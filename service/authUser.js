const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const users = require("../model/users");
const md5 = require("md5");
const jwt = require("../lib/jwt");

exports.getUsers = (req, res) => {
  users
    .getUsers(req.params.user_id)
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.json({});
    });
};

exports.register = (req, res) => {
  let user_data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: md5(req.body.password),
    security_answer: req.body.security_answer,
    status: "active",
  };

  console.log(user_data);
  const token = jwt.Encode(user_data);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "finalprojectwarehouse@gmail.com",
      clientId:
        "569155890539-k8mrehefv4l82sni60g3f6fca0fg68s4.apps.googleusercontent.com",
      clientSecret: "9xnCLcpvjN4T7lGQiWwctrny",
      refreshToken:
        "1//04Or2U0JrmsnJCgYIARAAGAQSNwF-L9IrZzlVW3eP0ysJXlPr9tnBxOT10vGiJvmiezQziGIcp4tTYlKSVDG8WxL0sZ-6hkTG3Z8",
    },
  });

  var mailOptions = {
    from: "Verification Account <finalprojectwarehouse@gmail.com>",
    to: `${user_data.email}`,
    subject: "Your Warehouse account: Email address verification",
    html: `<h3>Hello ${user_data.first_name} ${user_data.last_name} please verify your account just click link bellow:</h3>
    <h5>"http://localhost:3008/verification?token=${token}"</h5>`,
  };

  users.getUserDetailByEmail(req.body.email).then((getUserDetailByEmail) => {
    if (getUserDetailByEmail.length == 0) {
      transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
          console.log("Error kirim email!");
        } else {
          console.log("Email sukses terkirim!");
        }
      });
      users
        .insert(user_data)
        .then(() => {
          res.json({
            success: true,
            message: "register account successfull",
          });
        })
        .catch(() => {
          res.json({
            success: false,
            message: "failed to insert user into database",
          });
        });
    } else {
      res.json({
        success: false,
        message: "Oops. Email already registered, try another email",
      });
    }
  });
};

exports.login = (req, res) => {
  users
    .getUserDetailByEmailAndPassword(req.body.email, md5(req.body.password))
    .then((result) => {
      if (result.length > 0) {
        let user_data = {
          user_id: result[0].id,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          email: result[0].email,
          security_answer: result[0].security_answer,
        };

        console.log("user yg sedang login : ", user_data);

        const token = jwt.Encode(user_data);
        console.log(token);

        res.json({
          success: true,
          token,
        });
        return;
      }

      res.json({
        success: false,
        message: "Email or password do not match.",
      });
    });
};

exports.decodeToken = (req, res) => {
  const decoded_data = jwt.Decode(req.params.token);

  res.json({
    success: true,
    user_detail: decoded_data,
  });
};

exports.loginStatus = (req, res) => {
  users.loginStatus(req.body.email).then((result) => {});
  res.json({
    success: true,
  });
};

exports.getLoginStatus = (req, res) => {
  users.getLoginStatus(req.body.email).then((result) => {});
  res.json({
    success: true,
  });
};

exports.forgetPassword = (req, res) => {
  let user_data = {
    email: req.body.email,
    security_answer: req.body.security_answer,
  };

  console.log(user_data);
  const token = jwt.Encode(user_data);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "finalprojectwarehouse@gmail.com",
      clientId:
        "569155890539-k8mrehefv4l82sni60g3f6fca0fg68s4.apps.googleusercontent.com",
      clientSecret: "9xnCLcpvjN4T7lGQiWwctrny",
      refreshToken:
        "1//04Or2U0JrmsnJCgYIARAAGAQSNwF-L9IrZzlVW3eP0ysJXlPr9tnBxOT10vGiJvmiezQziGIcp4tTYlKSVDG8WxL0sZ-6hkTG3Z8",
    },
  });

  var mailOptions = {
    from: "Reset Password <finalprojectwarehouse@gmail.com>",
    to: `${user_data.email}`,
    subject: "Your Warehouse account: Reset Password",
    html: `<h3>Hello ${user_data.email} to change your password account just click link bellow :</h3>
    <h5>"http://localhost:3008/resetpassword?token=${token}"</h5>`,
  };

  users
    .getUserDetailByEmailAndSecurityAnswer(
      req.body.email,
      req.body.security_answer
    )
    .then((result) => {
      if (result.length > 0) {
        transporter.sendMail(mailOptions, (err, res) => {
          if (err) {
            console.log("Error kirim email!");
          } else {
            console.log("Email sukses terkirim!");
          }
        });
        res.json({
          success: true,
          token,
        });
        return;
      }

      res.json({
        success: false,
        message: "Email and Security answer not match.",
      });
    });
};

exports.resetpassword = (req, res) => {
  let user_data = {
    email: req.body.email,
    password: req.body.password,
  };
  console.log(user_data);
  users.getUserDetailByEmail(req.body.email).then((getUserDetailByEmail) => {
    if (getUserDetailByEmail.length > 0) {
      users
        .patchPassword(req.body.email, md5(req.body.password))
        .then(() => {
          res.json({
            success: true,
            message: "reset password successfully",
          });
        })
        .catch(() => {
          res.json({
            success: false,
            message: "failed to reset password",
          });
        });
    } else {
      res.json({
        success: false,
        message: "Email not Registered",
      });
    }
  });
};

exports.deactiveUser = (req, res) => {
  users.getUsers(req.params.user_id).then((result) => {
    users
      .deactiveUser(req.params.user_id)
      .then(() => {
        users.getUsers().then((result) => {
          res.json({
            success: true,
            users: result,
          });
        });
      })
      .catch(() => {
        res.json({
          success: false,
          message: "Failed to deactive users.",
        });
      });
  });
};

exports.activeUser = (req, res) => {
  users.getUsers(req.params.user_id).then((result) => {
    users
      .activeUser(req.params.user_id)
      .then(() => {
        users.getUsers().then((result) => {
          res.json({
            success: true,
            users: result,
          });
        });
      })
      .catch(() => {
        res.json({
          success: false,
          message: "Failed to deactive users.",
        });
      });
  });
};

exports.searchFirstName = (req, res) => {
  console.log("Query Search First Name : ", req.query);
  users
    .searchFirstName(req.query.search)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.searchLastName = (req, res) => {
  console.log("Query Search Last Name : ", req.query);
  users
    .searchLastName(req.query.search)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getActiveUser = (req, res) => {
  users
    .getActiveUser()
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.json({});
    });
};

exports.getInactiveUser = (req, res) => {
  users
    .getInactiveUser()
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.json({});
    });
};
