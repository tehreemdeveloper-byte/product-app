import Appsetting from '../models/appSettingsModel.js'
import AuthController from './authController.js';
import asyncHandler from 'express-async-handler';

export default class AppsettingsController extends AuthController {

    static PostAppData = asyncHandler(async (req, res) => {
        try {
            const { appdata } = req.body
            for (let i = 0; i < appdata.length; i++) {
                let key = appdata[i].key;
                let value = appdata[i].value;
                const keydata = await Appsetting.findOne({ key: key })
                if (keydata) {
                    const data = await Appsetting.findByIdAndUpdate(keydata._id, { value: value })
                } else {
                    const data = await Appsetting.create({ key, value })
                }
            }

            res.status(200).json(this.responseGenerator(null, 200, "App settings has been updated successfully"));
        } catch (error) {
            throw new Error(error)
        }
    });

    static GetAppData = asyncHandler(async (req, res) => {
        try {
            const appdata = await Appsetting.find();

            if (appdata && appdata.length > 0) {
                res.status(200).json(this.responseGenerator(appdata, 200));
            } else {
                res.status(404)
                throw new Error('App settings not found')
            }
        } catch (error) {
            throw new Error(error)
        }
    });
}