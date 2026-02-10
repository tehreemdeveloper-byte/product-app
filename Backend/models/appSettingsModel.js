import { mongoose } from 'mongoose'

const AppSchema = mongoose.Schema({
    key: {
        type: String,
    },
    value: {
        type: String
    }
}, {
    timestamps: true,
})

const App = mongoose.model('tbl_appsetting', AppSchema)
export default App