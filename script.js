//const { URL, URLSearchParams } = require('node-fetch');

function SearchTimetable()
{
var subject = document.getElementById("subject").value.toUpperCase();
var course = document.getElementById("course_number").value.toUpperCase();
var component = document.getElementById("component").value.toUpperCase();
var regex_subject = /^[A-Za-z]+$/;
var regex_course = /^[a-zA-Z0-9]+$/;
//console.log(component);
//console.log(course);
//console.log(subject);

if(subject.match(regex_subject) && subject!="")
{
    if(course.match(regex_course) && course!="")
    {
        if(component!="NONE")
        {
            fetch("http://localhost:3000/api/timetable/"+subject+ "/"+course +"/" + component)
            .then(response => response.json())
                
              .then(data => 
                {
                    console.log(data);
                    if(data.statusMessage)
                    {
                        alert(data.statusMessage);
                        document.getElementById("subject").value="";
                        document.getElementById("course_number").value="";
                        document.getElementById("component").value="none";
                    }
                    else
                    {
                        displayTimetable(data);
                        document.getElementById("subject").value="";
                        document.getElementById("course_number").value="";
                        document.getElementById("component").value="none";
                    }
                    
                })
              //.catch((error) => console.error("FETCH ERROR:", error));
        }
        else
        {
            if(component == "NONE")
            {
           // console.log("hii");
            fetch('http://localhost:3000/api/timetable/'+subject +"/"+course)
            .then(response => response.json())
            .then(data => 
            {
                if(data.length==0)
                    {
                       // console.log(data);
                        alert("Invalid details");
                        document.getElementById("subject").value="";
                        document.getElementById("course_number").value="";
                        document.getElementById("component").value="none";
                    }
                    else
                    {
                       // console.log(data);
                        document.getElementById("subject").value="";
                        document.getElementById("course_number").value="";
                        displayTimetable(data);
                    }
                
            })
        }
    }
    }
    else
    {
        if(!(course.match(regex_course)) && course!="")
        {
            alert("Please enter a valid course");
        }
        if(component=="NONE")
        {
        fetch('http://localhost:3000/api/timetable/'+subject)
        .then(response => response.json())
          .then(data => 
            {
                if(data.length==0)
                    {
                        alert("Invalid subject");
                        document.getElementById("subject").value="";
                        document.getElementById("course_number").value="";
                        document.getElementById("component").value="none";
                    }
                    else
                
                    {
                        document.getElementById("subject").value="";
                        document.getElementById("course_number").value="";
                        displayTimetable(data);
                    }
                
            })
        }
    
}
}
else
{
    alert("Please enter valid details for search");
    document.getElementById("subject").value="";
    document.getElementById("course_number").value="";
    document.getElementById("component").value="none";
}

}
function displayTimetable(data)
{
    var elementdiv = document.createElement("div");
    var search =  document.getElementById("search_results");

    if(data.statusMessage)
    {

        alert(data.statusMessage);
    }
    else
    {
    const timetable = data;
    var theTable = document.createElement("table");
   // theTable.setAttribute("border","1");
    const length_obj = data.length;
    var obj = JSON.parse(JSON.stringify(timetable[0]));
    var tr = document.createElement("tr");
    var variable = "course_info";
    var arr = ["Course", "Subject", "Class", "ClassNumber","StartTime", "Prerequisite", "EndTime", "Facility", "Days","Instructors","Section","Component","Status","Description","CatalogDes"];
    var length_head = arr.length;
    for(var i =0;i<length_head;i++)
    {
        var th= document.createElement("th");
        var text = document.createTextNode(arr[i]);
        th.appendChild(text);
        th.style.border ="1px solid #ddd";
        //th.style.border ="1px solid #ddd";
        th.style.backgroundColor = "#f2f2f2";
        tr.appendChild(th);
        theTable.appendChild(tr);
    }

    
   /* for (let key in obj)
    {
        if(key == variable)
        {
            var data_course = JSON.parse(JSON.stringify(obj[variable]))
           // console.log(data_course[0]);
           // console.log(Object.keys(data_course[0]));
            for(let key_1 in data_course[0])
            {
           // console.log(key_1);
           if(key_1 == "campus"|| key_1 == "instructors")
           {}
           else
           {
            var th = document.createElement("th");
            var text = document.createTextNode(key_1);
            th.appendChild(text);
            th.style.border ="1px solid #ddd";
            th.style.backgroundColor = "#f2f2f2";
            tr.appendChild(th);
            theTable.appendChild(tr);
            }
        }
        }
        else
        {
            
                var th = document.createElement("th");
                var text = document.createTextNode(key);
                th.appendChild(text);
                th.style.border ="1px solid #ddd";
                th.style.backgroundColor = "#f2f2f2";
                tr.appendChild(th);
                theTable.appendChild(tr);
            
        }  
    }*/

    for (var i = 0; i<length_obj;i++)
    {
        var obj_data = timetable[i];
        var length = obj_data.length;
        var tr = document.createElement("tr");
        for (let key in obj_data)
        {
            if(key == variable)
            {
            var data_course = JSON.parse(JSON.stringify(obj_data[variable]))
            for(let key_1 in data_course[0])
            {
                if(key_1 == "campus")
                {
                }
                
                else
                {
                var td = document.createElement("td");
                var text = document.createTextNode(data_course[0][key_1]);
                td.appendChild(text);
                tr.appendChild(td);
                theTable.appendChild(tr);
                }
            }
            }
            else
            {
                
                    var td = document.createElement("td");
                    var text = document.createTextNode(obj_data[key]);
                    td.appendChild(text);
                    tr.appendChild(td);
                    theTable.appendChild(tr);
                
                
            }
        }
    //theTable.style.borderCollapse="collapse";
    theTable.style.border="1px solid #ddd";
    tr.style.backgroundColor = "#f2f2f2";
    th.style.border ="1px solid #ddd";
    th.style.backgroundColor = "#f2f2f2";
    td.style.borderColor ="1px solid #ddd";
    td.style.padding = "8px";
    }
    
    elementdiv.appendChild(theTable);
    search.textContent=" ";
    search.appendChild(elementdiv);
}    
}
function SearchAvailableSubject()
{
    fetch('http://localhost:3000/api/subject')
            .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("NETWORK RESPONSE ERROR");
            }
          })
            .then(data => 
            {
                displayAvailableSubjects(data);
               // console.log(data);
            })
}


function displayAvailableSubjects(data)
{
    var elementdiv = document.createElement("div");
    var search =  document.getElementById("search_results");

    if(data.statusMessage)
    {

        alert(data.statusMessage);
    }
    else
    {
    const timetable = data;
    var theTable = document.createElement("table");
   // theTable.setAttribute("border","1");
    const length_obj = data.length;
    var obj = JSON.parse(JSON.stringify(timetable[0]));
    var tr = document.createElement("tr");
    var variable = "course_info";
    var arr = ["Course", "Subject"];
    var length_head = arr.length;
    for(var i =0;i<length_head;i++)
    {
        var th= document.createElement("th");
        var text = document.createTextNode(arr[i]);
        th.appendChild(text);
        th.style.border ="1px solid #ddd";
        //th.style.border ="1px solid #ddd";
        th.style.backgroundColor = "#f2f2f2";
        tr.appendChild(th);
        theTable.appendChild(tr);
    }

    for (var i = 0; i<length_obj;i++)
    {
        var obj_data = timetable[i];
        var length = obj_data.length;
        var tr = document.createElement("tr");
        for (let key in obj_data)
        {
            if(key == variable)
            {
            var data_course = JSON.parse(JSON.stringify(obj_data[variable]))
            for(let key_1 in data_course[0])
            {
                if(key_1 == "campus")
                {
                }
                
                else
                {
                var td = document.createElement("td");
                var text = document.createTextNode(data_course[0][key_1]);
                td.appendChild(text);
                tr.appendChild(td);
                theTable.appendChild(tr);
                }
            }
            }
            else
            {
                
                    var td = document.createElement("td");
                    var text = document.createTextNode(obj_data[key]);
                    td.appendChild(text);
                    tr.appendChild(td);
                    theTable.appendChild(tr);
                
                
            }
        }
    //theTable.style.borderCollapse="collapse";
    theTable.style.border="1px solid #ddd";
    tr.style.backgroundColor = "#f2f2f2";
    th.style.border ="1px solid #ddd";
    th.style.backgroundColor = "#f2f2f2";
    td.style.borderColor ="1px solid #ddd";
    td.style.padding = "8px";
    }
    
    elementdiv.appendChild(theTable);
    search.textContent=" ";
    search.appendChild(elementdiv);
}    
}
function SearchCoursebySubject()
{
    var subject = document.getElementById("subject").value.toUpperCase();
    var regex_subject = /^[A-Za-z]+$/;

    if(subject.match(regex_subject))
    {
        if(subject)
        {
            fetch('http://localhost:3000/api/course_code/'+subject)
                    .then((response) => {
                    if (response.ok) {
                    return response.json();
                    } else {
                    throw new Error("NETWORK RESPONSE ERROR");
                    }
                })
                    .then(data => 
                    {
                        if(data.statusMessage)
                        {
                            alert(data.statusMessage);
                            document.getElementById("subject").value="";
                        }
                        else
                        {
                        document.getElementById("subject").value="";
                        displayCoursebySubject(data);
                        }
                    // console.log(data);
                    })
        }
        else
        {
            alert("Please enter subject");
        }

    }
    else
    {
        alert("Please enter a valid subject");
        document.getElementById("subject").value="";
    }  

}

function displayCoursebySubject(data)
{
    var elementdiv = document.createElement("div");
    var search =  document.getElementById("search_results");

    if(data.statusMessage)
    {

        alert(data.statusMessage);
    }
    else
    {
    const timetable = data;
    var theTable = document.createElement("table");
   // theTable.setAttribute("border","1");
    const length_obj = data.length;
    var obj = JSON.parse(JSON.stringify(timetable[0]));
    var tr = document.createElement("tr");
    var variable = "course_info";
    var arr = ["Course"];
    var length_head = arr.length;
    for(var i =0;i<length_head;i++)
    {
        var th= document.createElement("th");
        var text = document.createTextNode(arr[i]);
        th.appendChild(text);
        th.style.border ="1px solid   #afa69e";
        //th.style.border ="1px solid #ddd";
        th.style.backgroundColor = "#afa69e";
        tr.appendChild(th);
        theTable.appendChild(tr);
    }

    
   
    for (var i = 0; i<length_obj;i++)
    {
        var obj_data = timetable[i];
        var length = obj_data.length;
        var tr = document.createElement("tr");
        for (let key in obj_data)
        {
            if(key == variable)
            {
            var data_course = JSON.parse(JSON.stringify(obj_data[variable]))
            for(let key_1 in data_course[0])
            {
                if(key_1 == "campus")
                {
                }
                
                else
                {
                var td = document.createElement("td");
                var text = document.createTextNode(data_course[0][key_1]);
                td.appendChild(text);
                tr.appendChild(td);
                theTable.appendChild(tr);
                }
            }
            }
            else
            {
                
                    var td = document.createElement("td");
                    var text = document.createTextNode(obj_data[key]);
                    td.appendChild(text);
                    tr.appendChild(td);
                    theTable.appendChild(tr);
                
                
            }
        }
    //theTable.style.borderCollapse="collapse";
    theTable.style.border="1px solid  #f5cccc";
    tr.style.backgroundColor = " #f5cccc";
    th.style.border ="1px solid  #f5cccc";
    th.style.backgroundColor = " #f5cccc";
    td.style.borderColor ="1px solid  #f5cccc";
    td.style.padding = "8px";
    }
    
    elementdiv.appendChild(theTable);
    search.textContent=" ";
    search.appendChild(elementdiv);
}    
}
function CreateSchedule()
{
    var name = document.getElementById("schedule_name").value.toLowerCase();
   // var regex_name = /^[A-Za-z]+$/;
    
    var headers = {
        'Accept': 'application/json',
        "Content-Type" : "application/json"
    };
    var input = {schedule_name:name};
    if(name)
    {
        fetch('http://localhost:3000/api/schedule',{ method: 'POST', headers: headers, body:JSON.stringify(input)})
            .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("NETWORK RESPONSE ERROR");
            }
          })
            .then(data => 
            {
                document.getElementById("schedule_name").value="";
                displayCreateSchedule(data);
                
            })

    }
    else
    {
        alert("Please enter a valid name for Schedule");
        document.getElementById("schedule_name").value="";
    }

}

function displayCreateSchedule(data)
{
    document.getElementById("schedule_name").value="";

    alert(data.result+data.statusMessage);

}
function SaveUpdateSchedule()
{
    //var subject_name = document.getElementById("subject").value;
    //var course = document.getElementById("course_number").value;
    var schedule = document.getElementById("schedule_name").value.toLowerCase();
   // var regex_schedule = /^[A-Za-z]+$/;
    var currentDiv = document.getElementById("javascriptfunc");
    var number_subjects = parseInt(document.getElementById("number_of_subjects").value);
    var number_courses = parseInt(document.getElementById("number_of_courses").value);
    var regex_number = /^[0-9]+$/;
    var elementdiv = document.createElement("div");
    if(schedule)
    {
        if(number_subjects)
        {
            var table = document.createElement("table");
            for(var i=0;i<number_subjects;i++)
            {
            var input_subject = document.createElement("input");
            var label = document.createElement("label");
            input_subject.name="subjects_array[]";
            input_subject.type="text";
            var content = document.createTextNode("Subject:");
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            label.appendChild(content);
            td.appendChild(label);
            td.appendChild(input_subject);
            tr.appendChild(td);
            table.appendChild(tr);  
            }
        for(var i=0;i<number_courses;i++)
        {
            var input_course = document.createElement("input");
            var label = document.createElement("label");
            input_course.type="text";
            input_course.name="courses_array[]";
            var content = document.createTextNode("Course:");
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            label.appendChild(content);
            td.appendChild(label);
            td.appendChild(input_course);
            tr.appendChild(td);
            table.appendChild(tr);  
        }
        elementdiv.appendChild(table);
        var save_button = document.createElement("button");
        save_button.innerHTML="Save/Update";
        save_button.type="button";
        save_button.style.borderRadius = "5px";
        save_button.style.height="30px";
        save_button.style.width="300px";
        save_button.style.border="2px solid #e2d8d8";
        elementdiv.appendChild(save_button);
        elementdiv.style.width="300px";
        elementdiv.style.height="300px";
        currentDiv.textContent=" ";
        currentDiv.parentNode.insertBefore(elementdiv,currentDiv);
        currentDiv.appendChild(elementdiv);

        save_button.addEventListener("click",function()
        {
            var subject_values = document.getElementsByName("subjects_array[]");
            var sub=[];
            var course_values = document.getElementsByName("courses_array[]");
            var courses=[];
            
            for(var i =0; i<subject_values.length;i++)
            {
                sub.push(subject_values[i].value.toUpperCase());
            }

            for(var i =0; i<course_values.length;i++)
            {
                courses.push(course_values[i].value.toUpperCase());
            }
            //console.log(sub);

        var headers = {
                "content-type" : "application/json"
            };
            var input = {subject:sub, course_code:courses};
            //console.log(input);
            //console.log(schedule);
            if(schedule)
            {
                if(sub)
                {
                    if(courses)
                    {
                        fetch('http://localhost:3000/api/schedule/'+schedule, {method: 'PUT', headers: headers, body:JSON.stringify(input)})
                        .then(response => response.json())
                        .then(data => 
                        {
                            document.getElementById("number_of_subjects").value="";
                            document.getElementById("number_of_courses").value="";
                            displayCreateSchedule(data);
                            currentDiv.textContent=" ";
                        // console.log(data);
                        })

                    }
                    else
                    {
                        alert("Please enter a valid course");
                        document.getElementById("schedule_name").value="";
                    }
                }
                else
                {
                    alert("Please enter a valid subject");
                }
            }

            else
            {
                alert("Please enter a valid schedule name and enter the valid subject and course");
            }
            })

            }
            else{
                alert("Please enter valid number of courses and subjects");
            }
        }
        else
        {
            alert("Please enter a valid schedule name");
            document.getElementById("schedule_name").value="";

        }
}

function Timetable_Schedule()
{
    var schedule_name = document.getElementById("schedule_name").value.toLowerCase();
    var regex_schedule=/^[A-Za-z]+$/;
    if(schedule_name.match(regex_schedule))
    {

        fetch('http://localhost:3000/api/courselistTimetable/'+schedule_name)
        .then(response => response.json())
          .then(data => 
            {
                //console.log(data);
                document.getElementById("schedule_name").value="";
                displayTimetable(data);
                
            })

    }
    else{
        alert("please enter valid schedule name");
        document.getElementById("schedule_name").value="";
    }


}


