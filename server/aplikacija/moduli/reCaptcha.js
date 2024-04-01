const Konfiguracija = require("../konfiguracija.js");

exports.provjeriRecaptchu = async function (token){
	try {
        const konf = new Konfiguracija();
        await konf.ucitajKonfiguraciju();
        
        console.log(konf.dajKonf().tajniKljucCaptcha);

        let parametri = { method: 'POST' };
        let o = await fetch("https://www.google.com/recaptcha/api/siteverify?secret=" + konf.dajKonf().tajniKljucCaptcha + "&response=" + token, parametri);
        
        let recaptchaStatus = JSON.parse(await o.text());
        console.log(recaptchaStatus);
        
        if (recaptchaStatus.success && recaptchaStatus.score > 0.6)
            return true;
        
        return false;
    } catch (error) {
        console.error("Error reading konfiguracija:", error.message);
        return false;
    }
}

  