# Rightpoint Budget Tracker

## Description

The Rightpoint Budget Tracker is a React app designed for project managers to efficiently track budget data and utilize different data visualization options.

It allows users to upload a CSV file containing hours, rate, employee name, project, job category, etc. data for one or several projects and organizes that data into table and chart visualizations. 


## Installation/Access

### Local

Clone the repository to your local machine.

$ git clone https://github.com/jonbmoore2500/dmrp-modifier.git
$ cd dmrp-modifier
$ npm install

Run the app locally.

$ npm start

Open the app in your browser.


### Deployed

Access a deployed copy reflecting the current stage of the Main branch at: https://dmrp-time-tool.onrender.com/

Deployed using the Render cloud hosting service. render.com 


## Data Format

The file to be processed must be a CSV and the data rows must be formatted correctly (my understanding is that RP's preexisting tools always export the data in this format, so as long as you don't modify the files before use with this app it should work just fine). It can handle multi- and single-project files, with a few sample rows for each provided below. The header rows are provided accurately, while the sample data includes anonymized data (names from The Office, random hours, random project names, etc.)

This README does not go into depth as to how the dates and projects work, as if you are using this you are already familiar with RP project management practices. 

Fields that are marked as *blank* are difficult to anonymize in any useful way and are irrelevant for the current functionality of the application, but they do need to be included in some way (even as empty fields) in order to keep the column count consistent. Just don't mess with the csv and you'll be fine.

### Multi-Project

Header Row - Project | User | Timesheet name | Date | Time (Hours) | Approval status | Charge - Hourly rate | Invoice # | Task | Description/Notes | User - Practice | User - Job Title | Allocation Type

Data Row 1 - ABC- 2022 Dev Dec-Dec | Scott, Michael | 12/17/22 to 12/23/22 | 12/22/22 | 1 | Approved | 205 USD | invoice1 | Project Management | *blank* | Management | role5 | CS (Billable)
Data Row 2 - ABC- 2022 Dev Dec-Dec | Scott, Michael | 12/24/22 to 12/30/22 | 12/29/22 | 1 | Approved | 205 USD | invoice2 | Project Management | *blank* | Management | role5 | CS (Billable)
Data Row 3 - ABC- 2022 Dev Dec-Dec | Schrute, Dwight | 12/31/22 to 01/06/23 - January | 01-05-23 | 1.5 | Approved | 205 USD | invoice3 | Development | *blank* | Dev | role7 | CS (Billable)
... and so on

### Single-Project

Header Row - User | Timesheet name | Date | Time (Hours) | Charge - Hourly rate (USD) | Charge - Total (USD) | Invoice # | Approval status | Task | Description/Notes | Task part of phase | User - Practice | Allocation Type | User - User Subsidiary

Data Row 1 - Scott, Michael | 12/17/22 to 12/23/22 | 12/22/22 | 1 | 100 | 100 | *blank* | Approved | Management | *blank* | *blank* | Management tasks | CS (Billable) | RP
Data Row 2 - Scott, Michael | 12/24/22 to 12/30/22 | 12/29/22 | 4 | 100 | 400 | *blank* | Approved | Management | *blank* | *blank* | Management tasks | CS (Billable) | RP
Data Row 3 - Schrute, Dwight | 12/31/22 to 01/06/23 - January | 01-05-23 | 1.5 | 80 | 120 | *blank* | Approved | Development | *blank* | *blank* | Development tasks | CS (Billable) | RP
... and so on


## Data Visualization

### Tables

Projects are organized alphabetically, with users within each project ordered in the same way. 

Each data column reflects a timesheet - the 4 most recent are displayed by default and more can be viewed through clicking the "More Weeks" button. Users that have not logged hours within 3 timesheets of the displayed timeframe are left out by default, but that can be toggled with the "Show Idles" button. The table defaults to just showing hours (per employee and total for a week) but the "Show Rates" button alters it to show rates as well, multiplying a given user's hours by their hourly rate. The entire table can be set back to its default through the "Reset" button.

Data can be copied from the table for use in other settings. A rectangular cell area can be selected by clicking and dragging, then copied with the "Copy to Clipboard" button - a notification will appear next to this button to confirm the successful copy. A selection can be canceled by clicking the cancel button, beginning a new selection, or clicking outside the table. Shift-click to select a range and ctrl-c to copy are currently NOT supported. 

### Charts/Graphs

The Graphs tab provides buttons to display the graph view for all available projects in a given CSV, although the Tables tab also includes links directly to each project's graph. Graphs use the D3 library.

All graph options use time as the X axis and dollars as the Y axis, and can be toggled between tracking time by week or by month. The two main graph options are a Stacked Area chart and a Line Chart with the option to compare actual to expected budget values.

#### Stacked Area
The default graph view is a stacked area chart, broken down by user. This can be toggled to display the data organized by role instead.

#### Line with Budget
Changing the Data View field to "Budget Compare" allows the user to enter a total budget value for the project, and the option to change the default start date for the project (the first day of the month when the project's timesheets begin) and the defualt project length (12 months). Once the budget is applied the chart adds a line reflecting this budget and changes the stacked area chart to a line showing the total spent for the project at each time increment, with the area between the two lines colored red or green to reflect the project being above or under budget, respectively.

The application currently assumes a constant budget spend rate over the life of the project, but it could be modified in the future to accept data that would allow more customization in this regard. 

More detailed tooltips are a work in progress. 

## File Structure

The project follows a typical React file structure, with components, custom quasi-hooks, and context files in those respective folders. 

## License

to be determined

## Contact Info

For support or questions, please contact the developer at jonathanmoorevla@gmail.com

## Acknowledgements

Thank you to D for the idea and continuing support. 