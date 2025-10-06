const nodemailer=require("nodemailer");


const SendEmail=async(options)=>{
    // 1) create transporter
    const transporter=nodemailer.createTransport({
        host:process.env.RESET_HOST,
        port:465,
        secure:true,
        auth:{
            user:process.env.RESET_USER,
            pass: process.env.RESET_PASS,
        }
    })

      // 2) define options (like from,to,subject,message)

      const mailOptions={
        from:"E-shop-app <blalabo89@gmail.com>",
        to:options.email,
        subject:options.subject,
        text:options.message
      }
        // 3) send email
        await transporter.sendMail(mailOptions)


}

module.exports=SendEmail;