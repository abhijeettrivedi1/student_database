import express from 'express';
import fs from 'fs';
import "./db/conn.mjs";
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from './models/registerations.mjs'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const partialsPath = path.join(__dirname, '../views/partials'); // Adjust the path based on your project structure
// console.log(partialsPath);
const port=3000;
app.set("view engine","hbs");
app.use(express.static("./public"));

hbs.registerPartials(partialsPath);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get("/register", async(req, res) => {
    try {
        res.render('index');
        console.log("home site working ")
    } catch (error) {
        console.error(error);
        res.status(500).render('Internal Server Error');
    }
});

app.get("/addsubj", async(req, res) => {
    res.render("addsub");
    
});
app.get("/addmarks", async(req, res) => {
    res.render("addmarks");
    
});
// Add this route in your Express app

app.get("/", async (req, res) => {
    try {
        // Fetch all students from the database
        const students = await Student.find();

        // Render the students.hbs file and pass the students data to it
        res.render("frontpage", { students });
    } catch (error) {
        console.error(error);
        res.status(500).render('Internal Server Error');
    }
});
app.post("/addsubj", async (req, res) => {
    try {
        let { subject, branch, CurrentSem, subjectcode,marksObtained } = req.body;
        if (!marksObtained) marksObtained = 0;

        

        // Define the update filter based on branch and current semester
        const filter = {
            branch: branch,
            CurrentSem: CurrentSem,
        };

        // Define the update
        const update =  {$push: { marks: { subjectcode, subject, marksObtained } }};

        // Perform the update for documents that match the filter
        const result = await Student.updateMany(filter, update);

        res.status(200).render("addsub",{message:"Subject Added successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// app.post("/addmarks", async (req, res) => {
//     try {
//         let { subjectcode, studentId, marksObtained } = req.body;

//         // Find the student by studentId
//         const student = await Student.findOne({
//             studentId: req.body.studentId,
//         });

//         if (student) {
//             // Update totalmarks by adding the new marksObtained value
//             student.totalmarks += parseFloat(marksObtained);
//             student.percentage = parseFloat(student.totalmarks/student.marks.length);
//         }

//         // Save the changes to the totalmarks field
//         await student.save();

//         // Define the update filter based on subject code and studentId
//         const filter = {
//             "marks.$.subjectcode": subjectcode,
//             studentId: studentId,
//         };

//         // Define the update

//         const update = { $set: { "marks.$.marksObtained": marksObtained } };


//         // Perform the update for documents that match the filter
//         const result = await Student.updateOne(filter, update);

//         if (result.matchedCount === 0) {
//             res.status(404).render("addmarks",{message: `Student with subject code '${subjectcode}' and studentId '${studentId}' not found.`,
//         })
//         } else {
//             res.status(200)("addmarks",{message: `Student with subject code '${subjectcode}' and studentId '${studentId}' not found.`,
//         })
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

app.post("/addmarks", async (req, res) => {
    try {
        let { subjectcode, studentId, marksObtained } = req.body;

        // Find the student by studentId
        const student = await Student.findOne({
            studentId: req.body.studentId,
        });

        if (student) {
            // Update totalmarks by adding the new marksObtained value
            student.totalmarks += parseFloat(marksObtained);
            student.percentage = parseFloat(student.totalmarks/student.marks.length);
        }

        // Save the changes to the totalmarks field
        await student.save();

        // Define the update filter based on subject code and studentId
        const filter = {
            "marks.subjectcode": subjectcode,
            studentId: studentId,
        };

        // Define the update
        const update = {
            $set: {
                "marks.$.marksObtained": marksObtained,
            },
        };

        // Perform the update for documents that match the filter
        const result = await Student.updateOne(filter, update);

        if (result.matchedCount === 0) {
                        res.status(404).render("addmarks",{message: `Student with subject code '${subjectcode}' and studentId '${studentId}' not found.`,
                    }) }
                    else {
            res.status(404).render("addmarks",{message: `Student with subject code '${subjectcode}' and studentId '${studentId}' marks updated.`,
        });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/register", async (req, res) => {
    try {
        // Create a new instance of the Student model with data from req.body
        const studentId=req.body.studentId;
        const newStudent = new Student({
                      name: req.body.name,
                      email: req.body.email,
                      studentId: req.body.studentId,
                      branch: req.body.branch,
                      CurrentSem: req.body.CurrentSem,
                      
                  });
    
        // Save the new student to the database
        const user=await Student.findOne({
          studentId: req.body.studentId,
      })
      if(user){
        res.status(400).send("Student already exists");
      }
      else{
        const savedStudent = await newStudent.save();
        console.log(savedStudent);
        res.status(201).render("index",{message:"Student of saved successfully"});
      }
      }
        catch (e) {
        res.status(400).send(e);
        console.log(e);
      }
    });
  
app.listen(port,()=>{3
    console.log(`Server is running at port ${port}`);
})