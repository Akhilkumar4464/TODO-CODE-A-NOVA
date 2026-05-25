 import mongoose from 'mongoose'
 
    const UserSchema =  new mongoose.Schema({
         UserName:{
            type:String,
            required:true,
            trim:true,
            
         },
         gmail:{
             type:String,
              required:true,
              trim:true,
              unique:true,
              lowercase:true,

         }, 
         "password":{
          type:String,
          required:true,
          trim:true,
          minlength:6,
         },

         timestamp:{
             type:Date,
             default:Date.now,
         }

    })

 export const User = mongoose.model('User', UserSchema)