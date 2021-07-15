// APP DEMO
// https://joi.dev/api/?v=17.4.0
// const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

//app.use('/', express.static(__dirname + '/public'));
app.use(express.static(__dirname + "/public"));
app.use(['/api/course','/api/courses'],express.static(__dirname + "/public"));

// PORT ENV VAR
const port = process.env.PORT || 7000;

let courses = [
    {id: 1, name: "Course 01", overview: "This is a brief overview of course one."},
    {id: 2, name: "Course 02", overview: "This is a brief overview of course two."},
    {id: 3, name: "Course 03", overview: "This is a brief overview of course three."}
];

let courseCount = courses.length;

let header = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Courses Demo</title>
    <link rel="stylesheet" href="styles.css">
    </head>
<body>`;
let footer = `</body></html>`;
root = "public";
app.get(['/','/api/courses'],(req,res) => {
    req.url = req.baseUrl;
    let result = header;
    result += `<h2>Courses (${courseCount})</h2>`;
    result += `<p>Refer to the <a href="https://expressjs.com/en/5x/api.html" target="_blank">Express API</a> for more info about Express.</p>`;
    result += footer;
    courses.forEach(course => result += `<h3>${course.name}</h3><p>${course.overview}<br><a href="${req.url}/api/course/${course.id}">${course.name}</a></p>`);
    res.send(result);
})

app.get('/api/course/:id',(req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        let result = header;
        result += `<h2>Course Unavailable</h2><p>That course does not seem to be on our list.<br><a href="../courses">View Courses</a></p>`;
        result += footer;
        res.status(404).send(result);
        return;
    }
    result = header;
    result += `<h2>${course.name}</h2><p>${course.overview}<br><a href="/">View Courses</a></p>`;
    result += footer;
    res.send(result);
})

app.post('/api/courses',(req,res) => {
    if(!req.body.name) {
        res.status(400).send('error.');
    } else {
        const course = {
            id: courses.length + 1,
            name: req.body.name,
            overview: req.body.overview
        };
        courses.push(course);
        res.send("The new course was added to the curriculum.");
    }
})

app.put('/api/course/:id',(req,res) => {
    let courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    if(!course) {
        res.status(404).send('No course with that ID is available.')
    } else if(!req.body.name || !req.body.overview) {
        res.status(400).send('error.');
    } else {
        course.name = req.body.name;
        course.overview = req.body.overview;
        res.send("The course was successfully updated.");
    }
})

app.delete('/api/course/:id',(req,res) => {
    let courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    if(!course) {
        res.status(404).send('No course with that ID is available.');
        return;
    } else {
        courses = courses.splice(courseId, 1);
        res.send(`The course named '${course.name}' was deleted from the curriculum.`);
        console.log(courses);
    }
})

app.use(function (req, res, next) {
    result = header;
    result += `<h2>Page Not Found</h2><p>Sorry, but that page does not seem to exist, you can continue by visiting our <a href="../">home page</a>.</p>`;
    result += footer;
  res.status(404).send(result)
})

app.listen(port, () => console.log(`Listening on port ${port}.`));