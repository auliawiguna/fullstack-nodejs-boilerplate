import nodemailer from 'nodemailer'
import path from 'path'
import hbs from 'nodemailer-express-handlebars'

class Mailer {
  constructor() {
    this.mailer = nodemailer.createTransport({
      port: process.env.MAIL_PORT,
      host: process.env.MAIL_HOST,
      secure: process.env.MAIL_SECURE=='true',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    })

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
          partialsDir: path.resolve('./views/mails'),
          defaultLayout: false,
      },
      viewPath: path.resolve('./views/mails'),
    }
    

    // use a template file with nodemailer
    this.mailer.use('compile', hbs(handlebarOptions))

  }

  /*
   *   message {
   *      from: "sender@server.com",
   *      to: "receiver@sender.com",
   *      subject: "Message title",
   *      text: "Plaintext version of the message",
   *      html: "<p>HTML version of the message</p>"
   *   }
   */
  async sendMail(message) {
    try {
      await this.mailer.sendMail(message, (error, info) => {
        console.log('Message sent: ' + info.response)
      })
    } catch (error) {
      console.log(`MAILER ERROR : ${error.message}`)
    }
  }
}

export default Mailer
