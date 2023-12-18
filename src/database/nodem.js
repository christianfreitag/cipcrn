const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = "pdeccorodeicotdedepplicecarccpde"
const key2 = "pdeccorodeicotdedepplicecarccpdepP0998dr1"
const iv = crypto.randomBytes(16);

module.exports = {

    encrypt(text){
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { ipw_userv: iv.toString('hex'),
        pwhash: encrypted.toString('hex') };
    },

    decrypt(text,ivs){
        
        let ivd = Buffer.from(ivs, 'hex');
        let encryptedText =
            Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv(
                algorithm, Buffer.from(key), ivd);
        
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },

    getJwtkey(){
        return key2;
    }

}