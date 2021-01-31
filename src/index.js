import { Console } from 'console';

const inquirer = require('inquirer');
const fetch = require("node-fetch");
const open = require('open');
const colors = require('colors');
const fs = require('fs');

const arg = require("arg")

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

const banner = `
|_|  _   _ _|_ |_|  _  ._ _   _  
| | (_) _>  |_ | | (_) | | | (/_                                             
`

var archivo = `
run = "tempCmdStart"
len = "tempLen"

----- ADVERTENCIA
NO MENTIR SOBRE LA INFORMACION SINO EL HOST SERA ELIMINADO
NO TOCAR NADA A NO SER QUE SEA NECESARIO
SI OCURRE UN ERROR PODEIS PONERLO AQUI (https://github.com/HostHome-of/node-CLI/issues)
-----
`

async function info() {
    return await inquirer.prompt([
        {
            name: "mail",
            message: "Escribe tu email",
            type: "input",
            default: 'null'
        },
        {
            name: "psw",
            message: "Escribe tu contraseña",
            type: 'password',
            mask: "*",
            default: 'null'
        }
    ])
}

async function login(mail, psw, web) {
    var data;
    await fetch(web + 'login?psw=' + psw + '&mail=' + mail, {
        method: "POST"
    }).then(
        response => response.json()
    ).then(dataj => {
        data = dataj
    });

    var noTieneCuenta = false;
    if (JSON.stringify(data) == "{}") {
        await inquirer.prompt({
            name: "mail",
            message: "Tu cuenta no existe ¿Quieres crearte una?",
            type: 'confirm',
            default: 'n'
        }).then(confirmar => {
            noTieneCuenta = confirmar.mail
            if (confirmar.mail == false) {
                process.exit(0)
            }
        })
    }

    if (noTieneCuenta == true) {
        await open(web + "register?c=1");
        console.log("Create una cuenta y luego buelve a iniciar".warn);
        return false;
    } else {
        return data
    }
}

async function preguntarPorArchivo() {
    return await inquirer.prompt([
        {
            name: "cmd",
            message: "Pon el comando de arranque para tu projecto",
            type: 'input'
        },
        {
            name: "lenguage",
            message: "Selecciona tu lenguage de programacion",
            type: 'list',
            choices: ["ruby", "python", "nodejs", "scala", "clojure", "cs", "php"]
        }
    ])
}

async function crearArchivo(verbose, cmd, lenguage) {
    if (verbose) {
        console.log("----- LOGS".info)
    }
    if (fs.existsSync('.hosthome')) {
        fs.writeFile(".hosthome", archivo.replace('tempCmdStart', cmd).replace('tempLen', lenguage), function (err) {
            if (err) {
                return console.error(err);
            }
            if (verbose) {
                console.log("Archivo localizado".warn);
                console.log("Eliminando archivos");
                console.log("Creando archivo")
                console.log("Reescribiendo archivo".info);
            }
        });
    } else {
        fs.appendFile('.hosthome', archivo.replace('tempCmdStart', cmd).replace('tempLen', lenguage), function (err) {
            if (err) throw err;
            if (verbose) {
                console.log('Archivo creado');
                console.log("Reescribiendo");
            }
        });
    }
}

async function crearProjecto(verbose) {
    preguntar = await preguntarPorArchivo()

    await crearArchivo(verbose, preguntar.cmd, preguntar.lenguage)
}

const crear = async (options) => {

    var verbose = false;
    var website;

    if (options["verbose"]) {
        verbose = true;
    }

    await fetch('https://raw.githubusercontent.com/HostHome-of/config/main/config.json').then(
        response => response.json()
    ).then(data => {
        // console.log(data["url"]);
        website = data["url"];
        console.log(banner);
        console.log("\n--- Login ---\n");
    });

    usuario = await info();

    const psw = usuario.psw;
    const mail = usuario.mail;

    if (psw == 'null' || mail == 'null') {
        process.exit(0)
    }

    usuario = await login(mail, psw, website);

    if (!usuario == false) {
        console.log(colors.green("\n-> Hola " + usuario["nombre"] + " " + usuario["segundoNombre"] + "\n"));

        await crearProjecto(verbose)
    }
}


function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--verbose': Boolean,
            "--eliminar": Boolean,
            "--stats": Boolean
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        verbose: args['--verbose'] || false,
        eliminar: args['--eliminar'] || false,
        stats: args['--stats'] || false,
    };
}

export function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    // console.log(options)
    
    if (!options["eliminar"] && !options["stats"]) {
        crear(options)
    } else {
        if(options["eliminar"]) {
            // eliminar()
        } else if (options["stats"]) {
            // stats()
        } else {
            console.log("Necesitas porner algo valido".error)
            console.log("Mirar docs")
        }
    }
}