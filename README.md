**Note: after download rename folder - name project**  
***
### 1) Install node and npm global (only once):  
 - Download: https://nodejs.org/en/ and install node.msi  
 - Testing: **node -v**, **npm -v**  
 **Note: For update node to new version repeat Point 1.**  
***

### 2) Git install:  
 - Download: https://git-scm.com/ and install git.msi (only once)  
 **Note: Select Run Git from the Windows command prompt**  
 - Testing: **git --version**  
 - Genterate SSH-key: C:\Program Files\Git\git-bash.exe (only once)  
 - Add key in my profile http://github.com  
 - Add globals config (anly once):  
   **git config --global user.name "grayni"**  
   **git config --global user.email "omenbestg@gmail.com"**  
 - In Local project and add repository:  
   **git init**  
   **git add .**  
   **git commit -a -m 'my commit'**  
   **git remote add origin git@github.com:username/reponame.git**  
   **git push -u origin master**  
***

### 3) Install gulp only once Global and in local project:  
 - Global install (only once): **npm install -g gulp**  
 - Local project install:  
   **Note: standart gulpfile.js and package.json exist in my template**  
 - Setting in package.json for local project:  
   write Name project and Description project  
 - npm i --save-dev gulp  
***

### 4) Install bower:  
 - npm i -g bower (only once)  
 - Go in local project and: **bower install**  
 - In bower.json write: Name and Description  
   **Note: default librarys: jQuery and bootsrap 4**  
***

# 5) for clone template and init project full:  
 - Create folder with name of project  
 - In this folder command: **git init**  
 - git clone git@github.com:Grayni/template_project.git  
 - **npm i**  
 - Add name and description in bower.json and package.json  
 - **bower install**  
 - In gulpfile.js add name in localhost and create host with this name
