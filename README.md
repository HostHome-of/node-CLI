

# CLI | Node

## Requerimientos

Para poder yutilizar el CLI de HostHome deberias de tener instalado node. Si no lo tienes puedes instalartelo [aqui](https://nodejs.org/es/).

Si quieres instalartelo con yarn deberias de tener instalado yarn (oviamente...) pero si no puedes instalartelo con `npm` ya que yarn es una mejor opcion porque es mas rapido y seguro.

```
npm install --global yarn
```

## Instalacion

Puedes instalartelo con [npm](https://www.npmjs.com/package/@hosthome/hosthome-cli) or you can install it with [yarn](https://yarnpkg.com/package/@hosthome/hosthome-cli)

### Node - instalacion

el comando seria asi

```
npm i -g @hosthome/hosthome-cli
```

Y al ejecutar el comando deberias de ver algo asi

```
C:\> npm i -g @hosthome/hosthome-cli
 (( □□□□□□□... )) Recieven package ...
```

Notar como le ponemos la bandera **-g** esto es muy importante ya que si no le ponermos esa bandera el CLI sera reconocido como un "package" o como un modulo y no queremos eso. Entoces hay que hacerlo _global_

Tambien se puede cambiar el `npm i` por el `npm install` ya que el comando es exactamente igual. Tambien abria que dejar el `@hosthome/` porque si no npm no encontrara el modulo y no lo instalara como un CLI.

Si hay un error lo mas posible es que sea nuestra culpa y te salgan cosas asi

```
npm ERR! Error: SSL Error: CERT_UNTRUSTED
```

Si eso te pasa con `npm` lo mas comun seria probar a hacerlo con yarn. Si eso no se consigue resolver tambien puedes instalartelo con `pip` (Que esta en la pagina siguiente de los documentos)

![CLI-Node](https://raw.githubusercontent.com/HostHome-of/website/main/src/static/images/cli.png)

### Yarn - instalacion

Una opcion preferiblemente mejor es instalarlo con [yarn](https://yarnpkg.com/package/@hosthome/hosthome-cli) ya que yarn hace una instalacion mas rapida.

Comando :

```
yarn global add @hosthome/hosthome-cli
```

Al ejecutar el comando deberia de salirte unas barras de carga enseñandote que se esta instalando.

```
C:\> yarn global add @hosthome/hosthome-cli
 [ ############################............... ] Reciebing package ...
```

En este comando podemos ver de que le ponemos `global` por la misma razon a la que le ponermos una bandera (**-g**) para que se instale global mente.

Yarn a dejado de utilizar el comando `install` y lo a remplazado por el comando `add` eso hay que tenerlo en cuenta para que nuestra instalacion de el CLI de yarn funcione.

Al igual que si hay un error con `yarn` una de las posibilidades es instalartelo con `npm`pero si eso sigue fallando deberias de contactarnos y enseñandonos el error en nuestro [github](https://github.com/HostHome-of) y te creas un nuevo issue. Y es exactamente los mismo que con `npm` si te sigue fallando intentalo instalar con `pip` que estan las instrucciones en la siguiente pagina de los documentos de los CLIs.

![CLI-Node](https://raw.githubusercontent.com/HostHome-of/website/main/src/static/images/cli-yarn.png)
