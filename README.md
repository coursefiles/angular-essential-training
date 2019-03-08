# Angular Essential Training

This is the repository for my course **Angular Essential Training**  
The full course is available at [LinkedIn Learning](https://www.linkedin.com/learning) and [lynda.com](https://lynda.com).  
[LinkedIn Learning subscribers: watch here](https://www.linkedin.com/learning/angular-2-essential-training-2)  
[Lynda.com subscribers: watch here](https://www.lynda.com/AngularJS-tutorials/Angular-2-Essential-Training/540347-2.html)  


## Course Description

JavaScript frameworks help you code more quickly, by providing special functionality for developing specific types of web projects. Angular was designed by Google to address challenges programmers face building single-page applications. This course introduces you to the essentials of this "superheroic" framework, including declarative templates, two-way data binding, and dependency injection. Justin Schwartzenberger steps through the framework one feature at a time, focusing on the new component-based architecture of Angular. After completing this training, you'll be able to tackle the other project-based courses in our library and create your own Angular app.

Topics include:
- What is Angular?
- Setting up an Angular template
- Creating a component
- Displaying data
- Working with events
- Using two-way data binding
- Creating a subcomponent
- Using the built-in HTTP module
- Using the built-in router module

## Instructions

1. Make sure you have these installed
  - [node.js](http://nodejs.org/)
  - [git](http://git-scm.com/)

2. Clone this repository into your local machine using the terminal (mac) or Gitbash (PC) 

    `git clone https://github.com/coursefiles/angular-essential-training.git`
    
3. CD to the folder

    `cd angular-essential-training`
    
4. Run the following to install the project dependencies:

    `npm install`
    
5. Run the ng serve command to build the code, watch for file changes, and serve up the site locally:

    `ng serve`

6. Navigate to http://localhost:4200. The app will automatically reload if you change any of the source files.

    `http://localhost:4200/`

The repository has a branch for each video starting point. For example, the branch **02-01b** is used as the starting code for the video *02-01 NgModule and the root module*. You can checkout branches using `git checkout -b <branchname>` and not have to re-run `npm install` each time since you will remain in the same root folder.


## Angular CLI
This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## FAQ
If you are getting a list of errors on `npm install` that look like `Cannot find name 'Promise'`, check your `package.json` file and see if the following DevDependencies have a caret in front of the version number (the ^ symbol):
```json
"devDependencies": {
  
  "@types/core-js": "0.9.34",
  "@types/node": "6.0.41"
  
}
```
If the caret is there (would look like `"@types/core-js": "^0.9.34"`) then remove it (or copy the contents of the [package.json](https://github.com/coursefiles/angular2-essential-training/blob/master/package.json) file on the origin repository) and run `npm install` again.
  
## More Stuff
Check out some of my [other courses on LinkedIn Learning](https://www.linkedin.com/learning/instructors/justin-schwartzenberger?u=2125562). 
You can also [follow me on twitter](https://twitter.com/schwarty).