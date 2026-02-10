import jwt from "jsonwebtoken";

export default class AuthController {
    static tokenGenerator = (id) => {
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });
        return token;
    };

    static responseGenerator(data = null, status = 200, message = null, token = null) {
        var response = {};
        response["status"] = status;
        if (message) {
            response["message"] = message
        }
        if (data) {
            response["data"] = data
        }
        if (token) {
            response["token"] = token;
        }
        return response;
    }
}
