const admins = require("../model/admins");
const md5 = require("md5");
const jwt = require("../lib/jwt");
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");

exports.login = (req, res) => {
  admins
    .getAdminDetailByEmailAndPassword(req.body.email, md5(req.body.password))
    .then((result) => {
      if (result.length > 0) {
        let admin_data = {
          admin_id: result[0].id,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          email: result[0].email,
        };

        console.log("admin yg sedang login : ", admin_data);

        const token = jwt.Encode(admin_data);
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
    admin_detail: decoded_data,
  });
};

exports.forgetPassword = (req, res) => {
  let admin_data = {
    email: req.body.email,
  };

  console.log(admin_data);
  const token = jwt.Encode(admin_data);

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
    from: "Reset Password Admin <finalprojectwarehouse@gmail.com>",
    to: `${admin_data.email}`,
    subject: "Your Fnichure Admin Account: Reset Password",
    html: `<h3>Hello Admin ${admin_data.email} to change your password account just click link bellow :</h3>
    <h5>"http://localhost:3009/resetpassword?token=${token}"</h5>`,
  };

  admins.getAdminDetailByEmail(req.body.email).then((result) => {
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
      message: "Email not registered.",
    });
  });
};

exports.resetpassword = (req, res) => {
  let admin_data = {
    email: req.body.email,
    password: req.body.password,
  };
  console.log(admin_data);
  admins.getAdminDetailByEmail(req.body.email).then((getUserDetailByEmail) => {
    if (getUserDetailByEmail.length > 0) {
      admins
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
