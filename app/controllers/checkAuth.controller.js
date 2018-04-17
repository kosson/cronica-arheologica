/**
 * Middleware utilizat pentru a proteja anumite rute
 * acesta este un middleware prin care este verificat dacă un utilizator este autentificat sau nu
*/
const settings = require('../config/settings');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // extrage tokenul din header
        // trebuie făcut un split pentru că primești și Bearer: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJl......"
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, settings.JWT_SECRET);    
        // const decoded = jwt.verify(req.body.token, settings.JWT_SECRET);
        // adaugi în obiectul request o nouă proprietate pentru ca aceasta la
        // viitoarele cereri vor avea disponibil jwt-ul verificat
        req.userData = decoded;
        // dacă autentificarea a reușit, cheamă următorul middleware
        next();
    } catch (error) {
        return res.json({
            message: 'Autentificarea a eșuat!',
            error
        });
    }
};