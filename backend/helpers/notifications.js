import sendMailQueue from './../config/bull.js'
import dotenv from 'dotenv'

/**
 * Handle registration email
 *
 * @param   string  emailTo  userModel.email
 * @param   string  token    6 digits token
 * @param   string  name     userModel.first_name
 *
 * @return  mixed
 */
const registrationEmail = (emailTo, token, name) => {
  dotenv.config()

  const messages = {
    from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
    to: emailTo,
    subject: `Complete you registration`,
    template: 'register',
    context: {
      name: name,
      token: token
    }
  }

  const options = {
    attempts: 2,
  }
  const data = messages

  // Producer: adds jobs to que, in this case emails to be sent out upon signup
  sendMailQueue.add(data, options)
}

/**
 * Handle change profile notification
 *
 * @param   string  emailTo            userModel.email
 * @param   string  name               userModel.first_name
 * @param   string  changedAttributes  Description of changed attributes (UL HTML)
 *
 * @return  mixed
 */
const changedProfile = (emailTo, name, changedAttributes) => {
    dotenv.config()

    const messages = {
      from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
      to: emailTo,
      subject: `Your profile has been changed`,
      template: 'changed_profile',
      context: {
        name: name,
        changedAttributes: changedAttributes
      }
    }  
  
    const options = {
      attempts: 2,
    }
    const data = messages
  
    // Producer: adds jobs to que, in this case emails to be sent out upon signup
    sendMailQueue.add(data, options)
}

/**
 * Handle if user(s) change their email address
 *
 * @param   string  name      userModel.first_name
 * @param   string  oldEmail  userModel.email
 * @param   string  newEmail  New email address
 * @param   string  token     SHA token
 *
 * @return  mixed
 */
const changedEmail = (name, oldEmail, newEmail, token) => {
  dotenv.config()

  const messages = {
    from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
    to: oldEmail,
    subject: `Finalise your email change`,
    template: 'changed_email',
    context: {
      name: name,
      be_url: `${process.env.APP_URL}/api/v1/auths/change-email/${token}`,
      fe_url: process.env.FRONTEND_URL,
      oldEmail: oldEmail,
      newEmail: newEmail,
      token: token
    }
  }  

  const options = {
    attempts: 2,
  }
  const data = messages

  // Producer: adds jobs to que, in this case emails to be sent out upon signup
  sendMailQueue.add(data, options)

}

// Consumer: this gets called each time the producer receives a new email.
sendMailQueue.process(async job => {
  await MAILER.sendMail(job.data)
})

const Notifications = { registrationEmail, changedProfile, changedEmail }

export default Notifications