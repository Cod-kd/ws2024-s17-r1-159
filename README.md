* **Page: ws2024-s17-r1-159.netlify.app**
* **ID: 159**
* **Name: Dániel Murányi**

# ULTRABALATON Prototype

**The prototype version of the project contains only the most important features.**

## Landing page

###### Browser compatibility:
* Chrome
* Firefox

###### Supported viewports:
* 360x640
* 768x1024
* 1920x1080

## Calculator
In calculator.js there is a bug witch can be tarce back to line 78-87, 77, 62. If you have a solution please feel free to send me an e-mail to: muranyi.daniel0@gmail.com
_While the problem is not solved please note that the calculator is works in privileged mode._

###### The Team Member Table
* The name and speed are modifiable and the changes will store in the **_LocalStorage_**.
* You can add speed like "1234" and when you reload the page it will be automatically formatted.
* The distances is stored in a independed particle.
* When you reload the page it replaces the table all the data what from the LocalStorage.


###### The Stage Assignment Table
* The Stage Assignment Table automatically filled up with the basic informations.
* You can start type or select a runner (with valid data) based on what browser are you in and it trigger a reaction witch calls a function what calculate the time column.
* The used URL to get the required informaions is: https://ub2023-backend.onrender.com/api/v1/stages/
* When you reload the page it replaces the table all the data what from the LocalStorage.

###### About the data structure
* Change the first- or the lastname in the team member table and as soon as you reload the page the stage assignment table will update too.
* This method is also works with the speed and time.

###### Complete the table step by step
1. Write in the first- the and lastname parameters!
2. Fill the speed with four digits for example: 1103 (That is means the runner need 11:03 [minute:second] to run a kilometer)!
3. Select a runner from the stage assignment table from the desired row of the "Runners" column using the drop-down list, or start typing the name of the runner whose data you have already entered correctly (in Chrome by click on the dark triangle, in Firefox by double-click in the input field)!
