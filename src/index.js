const inquirer = require('inquirer');
const fetch = require("node-fetch");
const open = require('open');
const colors = require('colors');
const fs = require('fs');

const arg = require("arg")

var pjson = require('../package.json');

const ayuda = `
Uso:
    hosthome [-h | --help]
    hosthome [--verbose]
    hosthome [--eliminar] [--verbose] 
    hosthome [--info] <id:str>
    hosthome [-v | --version]

Argumentos:
    --help (-h)     :: Enseña este mensage
    --verbose       :: Dice lo que esta pasando
    --info          :: Te da la info sobre algun host
    --version (-v)  :: Da la version del CLI
    --eliminar      :: Elimina un proyecto
`

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
| | (_) _>  |_ | | (_) | | | (/_    - nodejs                                             
`

var archivo = `
run = "tempCmdStart"
len = "tempLen"

----- ADVERTENCIA
NO MENTIR SOBRE LA INFORMACION SINO EL HOST SERA ELIMINADO
NO TOCAR NADA A NO SER QUE SEA NECESARIO
SI OCURRE UN ERROR PODEIS PONERLO AQUI (https://github.com/HostHome-oficial/node-CLI/issues)
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
    await fetch(web + 'login?psw=' + psw + '&mail=' + mail + "&consola=si", {
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
    const preguntar = await preguntarPorArchivo()

    await crearArchivo(verbose, preguntar.cmd, preguntar.lenguage)
}

const crear = async (options) => {

    var verbose = false;
    var website;
    var infoUsr;
    var usuario;

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

    infoUsr = await info();

    const psw = infoUsr.psw;
    const mail = infoUsr.mail;

    if (psw == 'null' || mail == 'null') {
        console.log("Intenta poner algo".error);
        process.exit(0);
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
            "--stats": Boolean,
            "--help": Boolean,
            "--version": Boolean,
            '-h': '--help',
            "-v": "--version"
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        verbose: args['--verbose'] || false,
        eliminar: args['--eliminar'] || false,
        stats: args['--stats'] || false,
        ayuda: args['--help'] || false,
        version: args['--version'] || false,
    };
}

export function cli(args) {
    var options;
    try {
        options = parseArgumentsIntoOptions(args);
    } catch (e) {
        console.log("No se encontro ese comando, intenta \"hosthome -h\"".error);
        return;
    }
    // console.log(options)
    
    if (options["ayuda"]) {
        console.log(ayuda)
        return;
    } else if (options["version"]) {
        console.log("HostHome-CLI | Node :: v = "+pjson.version)
        return;
    }

    if (!options["eliminar"] && !options["stats"]) {
        crear(options)
    } else {
        if(options["eliminar"]) {
            // eliminar()
        } else if (options["stats"]) {
            // stats()
        } else {
            console.log("No se a podido encontrar ese comando".error)
            console.log("Intenta poner \" hosthome -h\"".warn)
        }
    }
}