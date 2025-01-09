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
function sendMyMail(mTo, mSubject, mFirstname, mPassword)
{
    var mailOptions = {
    from: 'esteban.gonzaleztessier@gmail.com',
    to: mTo,
    subject: mSubject,
    html:
    `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                body
                {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                }

                #container
                {
                    border: 1px solid black;
                    border-radius: 15px;

                    padding: 20px;

                    width: 60%;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                #Titre
                {
                    background-color: rgb(195, 87, 195);
                    color: white;
                    border-radius: 15px;
                    width: 100%;
                    height: 60px;

                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    font-size: 30px;
                }

                #containerMotDePasse
                {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }

                #motDePasse
                {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 40px;
                    width: 40%;
                    gap: 20px;

                    border-radius: 15px;
                    padding: 10px;
                    background-color: lightgray;
                }

                #containerButton
                {
                    margin-top: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                button
                {
                    border: 1px solid gray;
                    background-color: white;
                }
            </style>
        </head>
        <body>
            <script>
                function copier()
                {
                    // Récupérer le texte de l'élément
                    var texte = document.getElementById('motDePasseCopier').innerText;

                    // Copier le texte dans le presse-papiers
                    navigator.clipboard.writeText(texte).then(function() {
                        console.log('Texte copié avec succès :', texte);
                        alert('Texte copié : ' + texte); // Alerte pour confirmer la copie
                    }).catch(function(err) {
                        console.error('Erreur lors de la copie :', err);
                    });
                }
            </script>

            <div id="container">

                <div id="Titre">
                    <p>Pharmeo</p>
                </div>

                <div id="texteDescriptif">
                    <p>
                        Objet : Récupération de votre mot de passe
                        <br>
                        <br>
                        Bonjour ${mFirstname},
                        <br>
                        Suite à votre demande, voici votre mot de passe :
                        <br>
                        <div id="containerMotDePasse">
                            <div id="motDePasse">
                                <p id="motDePasseCopier">${mPassword}</p>
                            </div>
                        </div>

                        <div id="containerButton">
                            <button onclick="copier()">Copier le mot de passe</button>
                        </div>
                        
                        <br>
                        Nous vous recommandons de le modifier dès que possible pour garantir la sécurité de votre compte.
                        Si vous avez d'autres questions ou besoin d'assistance, n'hésitez pas à nous contacter.
                        <br>
                        <br>
                        Cordialement,
                        <br>
                        <br>
                        PHARMEO
                        <br>
                        <br>
                        <a href="tel:+33601010101">06.01.01.01.01</a>
                        <br>
                        <br>
                        <a href="mailto:parmeo3@gmail.com">parmeo3@gmail.com</a>
                    </p>
                </div>

            </div>
        </body>
        </html>
    `
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

