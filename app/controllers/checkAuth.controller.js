/**
 * Middleware utilizat pentru a proteja anumite rute
 * acesta este un middleware prin care este verificat dacă un utilizator este autentificat sau nu
*/
const settings = require('../../config/settings');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // extrage tokenul din header
        // trebuie făcut un split pentru că primești și Bearer-ul: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJl......"
        // console.log(req.headers);
        
        const token = req.headers.authorization.split(" ")[1]; // folosit în cazul în care decizi să folosești și form-data
        // Ai nevoie să faci split pentru a separa convenționalul string „Bearer” de stingul token-ului
        // [Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6...]
        // în header câmpul trebuie să fie „Authorization”
        // console.log(token);
        const decoded = jwt.verify(token, settings.JWT_SECRET);    
        // metoda verify, va decoda conținutul și îl va verifica.

        // adaugi în obiectul request o nouă proprietate cu tokenul decodificat
        // viitoarele cereri vor avea disponibil jwt-ul verificat si vor putea ușor verifica dacă userul este autentificat
        req.userData = decoded;
        // dacă autentificarea a reușit, cheamă următorul middleware
        console.log(decoded);
        
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Autentificarea a eșuat!',
            error: error.message
        });
    };
};