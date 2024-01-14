import mongoose from "mongoose";
const {Schema} = mongoose;
const StudentSchema = new Schema({
    name:{
        type : String,
        required : true
    },
    studentId:{
        type : String,
        
    },
    totalmarks:{
        type : Number,   
        default:0 ,
    },
    email:{
        type : String,
        required : true
    },
    CurrentSem:{
        type : Number,
        required : true
    },
    date:{
        type : Date,
        default : Date.now
    },
    branch:{
        type: String,
        required: true,
    },
    percentage:{
        type:Number,
        default:0
    },
    marks: [
        {
          subjectcode: {
            type: String,
          },
          subject: {
            type: String,
            
          },
          marksObtained: {
            type: Number,
          },
        },
      ],

})
const Student  = mongoose.model("Student",StudentSchema);
export default Student;