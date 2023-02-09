const nodemailer = require('nodemailer');

class Controller {
  async sendMail(req, res, next) {
    const { name, email, seminar } = req.body;
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'workprogexam12@gmail.com',
          pass: process.env.PASS,
        },
      });
      await transporter.sendMail({
        from: 'workprogexam12@gmail.com',
        to: email,
        subject: 'Заявка',
        text: `Привет ${name}, благодарим тебя за запись на ${seminar} семинар. Организаторы свяжутся с вами в ближайшее время для подтверждения записи. С наилучшими пожеланиями ... `, // plain text body
      });

      res.json(
        'Ваша заявка успешно отправлена и находится в обработке. Ожидайте email с подтверждением бронирования',
      );
    } catch {
      res.json('Не удалось отправить сообщение.');
    }
  }
}
module.exports = new Controller();
