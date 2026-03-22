
const userModel = require('../../models/user.models');
const bcrypt = require('bcrypt');

async function updatePassword(req, res) {

    const {id} = req.params;

    try {
        const searchUser = await userModel.findByIdAndUpdate(id,
            { $set: {
                password: bcrypt.hashSync(req.body.password, 10 ) }
            },  {new: true}
        )
        res.status(200).json({searchUser})

    } catch (error) {
        res.status(500).json({msg: 'Error al actualizar el usuario'})
        
    }
    
}

module.exports = updatePassword;