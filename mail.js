import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
    host: "127.0.0.1",
    port: 1025
});

// TODO : Changer le smtp lors de la mise en prod
/*
Pour tester les mails : 
-> Lancer mailpit dans le terminal
-> Se connecter localhost:8025
*/

// --- La fonction pour envoyer un mail
function sendMyMail(mTo, mSubject, mText)
{
    var mailOptions = {
    from: 'esteban.gonzaleztessier@gmail.com',
    to: mTo,
    subject: mSubject,
    text: mText
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

// --- J'exporte la fonction pour qu'elle soit utilisable dans les autres classes
export {sendMyMail};

