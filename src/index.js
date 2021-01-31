const inquirer = require('inquirer');
const fetch = require("node-fetch");
const open = require('open');
const colors = require('colors');
const fs = require('fs');

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

function crearArchivo() {
    if (fs.existsSync('.hosthome')) {
        fs.writeFile(".hosthome", "Hey there!", function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Archivo creado".info);
        });
    }   
}

function crearProjecto() {
    crearArchivo()
}

const main = async () => {
    var website;
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

        crearProjecto()
    }
}

main()