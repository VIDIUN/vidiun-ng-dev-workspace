# Vidiun Dev Workspace

[![Gitter chat](https://badges.gitter.im/vidiun-ng/dev-tools.png)](https://gitter.im/vidiun-ng/dev-tools) [![npm version](https://badge.fury.io/js/%40vidiun-ng%2Fdev-workspace.svg)](https://badge.fury.io/js/%40vidiun-ng%2Fdev-workspace)

Tool for managing JavaScript projects with multiple packages. 

## About

Our code base for [vmc-ng](https://github.com/vidiun/vmc-ng) and [tvm-ng](https://github.com/vidiun/tvm-ng) is organized into multiple packages/repositories. However, making changes across many repositories is messy.

For [monorepos](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) there is a great tool named [lerna](https://github.com/lerna/lerna) that optimizes the workflow around managing multi-package repositories with git and npm.
 
 But in our case with have a mix of:
 - single package repo.
 - single application repo.
 - multiple packages in monorepo.
 
 Unfortunately [lerna](https://github.com/lerna/lerna) only support monorepo so we cannot use it as-is.
  
 To overcome this issue we created this tool.
   
 > Vidiun dev workspace package is inspired deeply from `lerna` tool. We find `lerna` the best tool that simplify complicated dev-op operation. We recommend you to try `lerna` for your own projects.  
   
## Who should use this tool
This tool was created for Vidiun applications development and is not suppose to be used for other projects.

## Getting Started

#### Prerequisites

- [x] Ensure you have [node.js installed](https://nodejs.org/en/download/current/), version 7.0.0 or above. 
- [x] Ensure you have [git installed](https://git-for-windows.github.io/) 
- [x] Ensure you have npm installed, version 5.0.0 or above.

#### Setup your workspace
1. create a folder to hold your packages (your workspace root folder).
2. create `package.json` in your root folder by running the following command:
```
 $ npm init -y
 ```
3. add this tool to your folder in your root folder by running the following command:
```
$ npm install @vidiun-ng/dev-workspace
```

4. create file `vidiun-ws.json` in your root folder with the following format:

```json
 {
   "version" : "2.0.0",
   "repositories": [
     { "origin" : "github", "uri": "https://github.com/vidiun/vidiun-ng.git"},
     { "origin" : "github", "uri": "https://github.com/vidiun/vidiun-ng-mc-theme.git"},
     { "origin" : "github", "uri": "https://github.com/vidiun/vmc-ng.git"}
   ],
   "licenses" : {
     "ignoreList" : [      
       "vidiun-typescript-client"
     ]
   }
 }

```
**Notes**: 
- **you should modify repositories property to hold a list of relevant repositories to your vidiun project ordering them by the dependency constraints**.
- the sample above will setup your workspace to develop [vmc-ng application](https://github.com/vidiun/vmc-ng).
  
5. add the following to your `package.json`:
```json
{  
  "scripts" : {
    "vws" : "vws",
    "setup" : "vws setup",
    "build" : "vws run build",
    "licenses" : "vws licenses",
    "clean" : "vws clean"
  }
}
```

6. run setup command to build & symlink your repositories
```bash
$ npm run setup
```

  
## Commands

#### init

#### setup

#### run

#### licenses

#### clean
 
 