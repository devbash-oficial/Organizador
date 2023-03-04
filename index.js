const fs = require("fs")
const chalk = require("chalk")
const readline = require("readline-sync")

let inicialDir = undefined
let lastDir = undefined
let terminado = false

console.log(chalk.red("==================================================================="))
console.log(chalk.red("|                                                                 |"))
console.log(chalk.red("|                                                                 |"))
console.log(chalk.red("|                                                                 |"))
console.log(chalk.red("|                       ") + chalk.bgBlue("  AUTO-ORGANIZER  ") + chalk.red("                        |"))
console.log(chalk.red("|                   ") + chalk.bgCyan("Hecho por TutoMine Y AlexK") + chalk.red("                    |"))
console.log(chalk.red("|                                                                 |"))
console.log(chalk.red("|                                                                 |"))
console.log(chalk.red("|                                                                 |"))
console.log(chalk.red("==================================================================="))
console.log("")

inicialQuestion()

function inicialQuestion() {
    inicialDir = readline.question(chalk.yellow("¿Que carpeta quieres que se organize?: ")).replaceAll("\\", "/")
    if (!fs.existsSync(inicialDir) || !fs.statSync(inicialDir).isDirectory()) {
        console.log(chalk.bgRed("Carpeta no valida."))
        inicialQuestion()
    }
    lastQuestion()
}
function lastQuestion() {
    lastDir = (readline.question(chalk.yellow("¿En donde quieres que se guarden los archivos organizados?: "))).replaceAll("\\", "/")
    if (!fs.existsSync(lastDir) || !fs.statSync(lastDir).isDirectory()) {
        console.log(chalk.bgRed("Carpeta no valida."))
        inicialQuestion()
    }
    start()
}

async function start() {
    console.log(chalk.bgGreen("Moviendo archivos..."))
    console.log(chalk.bgYellow("NO CIERRES ESTA VENTANA, PUEDE PROVOCAR PERDIDA DE DATOS"))

    let files = []
    // escanear y buscar los archivos
    await fs.readdirSync(inicialDir).forEach(async file => {
        if (await fs.statSync(`${inicialDir}/${file}`).isDirectory()) {
            return console.log(chalk.bgBlue(`${file} es una Carpeta`))
        }
        let name = file.split(`.`)
        let fileType = name[name.length - 1]
        await files.push({ type: fileType, name: name[0], all: file })
    })

    organizar()

    function organizar () {
        let answer = readline.question(chalk.yellow(`¿Quieres organizar ${files.length + 1} archivos? (Si/No): `)).toLocaleLowerCase()
        switch (answer) {
            case "no":
                console.log(chalk.bgYellow("Regresando..."))
                inicialQuestion()
                break;
    
            case "si":
                console.log(chalk.bgGreen("Organizando archivos..."))
                break;
    
            default:
                console.log(chalk.bgRed("Regresando..."))
                organizar()
                break;
        }
    }

    for (let i = 0; i < files.length; i++) {
        let File = files[i]
        if (!await fs.existsSync(lastDir + "/" + File.type.toUpperCase())) {
            await fs.mkdirSync(lastDir + "/" + File.type.toUpperCase())
        }
        console.log(chalk.bgYellow("(MOVIENDO) ->") + " " + chalk.bgCyan("Moviendo archivo " + File.all))
        await move()
        await unlink()
        async function unlink() {
            console.log(chalk.bgGreen("(MOVIDO)   ->") + " " + chalk.bgGreen("Archivo " + File.all + " movido con exito."))
            await fs.unlinkSync(`${inicialDir}/${File.all}`)
        }
        async function move () {
            await fs.cpSync(`${inicialDir}/${File.all}`, `${lastDir}/${File.type.toUpperCase()}/${File.all}`)
        }
    }

    await closeQuestion()
}

function closeQuestion() {
    console.log(chalk.bgYellow("(MOVIDOS)  ->") + " " + chalk.bgGreen("Todos los archivos movidos con exito."))
    let answer = readline.question(chalk.yellow("¿Quieres repetir este proceso? (Si/No): "))
    answer = answer.toLowerCase()
    switch (answer) {
        case "no":
            process.exit()
            break;

        case "si":
            console.log(chalk.bgYellow("Regresando..."))
            inicialQuestion()
            break;

        default:
            closeQuestion()
    }
}

// Hecho por los mas pros de todos > AlexK y TutoMine