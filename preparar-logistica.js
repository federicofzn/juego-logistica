// Genera el material base del juego a partir de conceptos de las clases de Logística.
const fs = require('fs');
const path = require('path');
const root = __dirname;
const units = [
  { id: 'clase1', title: 'Clase 1: Introducción a la logística', topics: [
    ['Logística','Planificación, ejecución y control del movimiento y almacenamiento de bienes y la información relacionada.','Una empresa coordina inventario, depósito y entregas para atender sus pedidos.'],
    ['Cadena de suministro','Red de organizaciones y procesos que intervienen desde los insumos hasta el cliente final.','Un fabricante coordina proveedores, producción, distribuidores y clientes.'],
    ['Administración de materiales','Gestión del abastecimiento y movimiento de materiales necesarios para la producción o el servicio.','Se coordinan compras, recepción y almacenamiento de materias primas.'],
    ['Distribución física','Gestión del almacenamiento y movimiento de productos terminados hacia el cliente.','Un depósito prepara productos terminados para enviarlos a los comercios.'],
    ['Logística inversa','Gestión del retorno de productos, envases o materiales desde el cliente hacia otro destino.','Un comercio organiza la devolución de artículos defectuosos para su reparación.'],
    ['Nivel de servicio','Condiciones de disponibilidad, cumplimiento y respuesta ofrecidas al cliente.','Una empresa mide si entrega los pedidos completos y en el plazo prometido.']
  ], wrong: 'La logística se limita al transporte y no incluye inventarios ni almacenamiento.', correction:'La logística también incluye inventarios, almacenamiento y otras actividades.' },
  { id:'clase2', title:'Clase 2: Planeamiento y servicio', topics:[
    ['Enfoque sistémico','Análisis coordinado de actividades relacionadas que influyen unas sobre otras.','La empresa evalúa conjuntamente compras, inventario, transporte y servicio.'],
    ['Planeamiento logístico','Definición de cómo abastecer, almacenar y distribuir según demanda, recursos, costos y servicio.','Un equipo calcula capacidad, inventario y distribución antes de una campaña.'],
    ['Servicio al cliente','Condiciones y acciones que atienden las necesidades del cliente antes, durante y después de la compra.','La empresa informa el estado de un pedido y responde ante una demora.'],
    ['Disponibilidad','Posibilidad de contar con el producto requerido cuando el cliente lo necesita.','El artículo solicitado está en stock cuando llega el pedido.'],
    ['Entrega completa','Cumplimiento de las cantidades y productos solicitados en una orden.','El cliente recibe todas las unidades y referencias que había comprado.'],
    ['Coordinación entre áreas','Intercambio de información para alinear las decisiones de logística con las de otras funciones.','Ventas informa una promoción y compras ajusta el abastecimiento.']
  ],wrong:'El planeamiento logístico se realiza una sola vez y no necesita actualizarse.',correction:'La planificación debe revisarse cuando cambian la demanda y otras condiciones.'},
  { id:'clase3', title:'Clase 3: Almacén y depósito', topics:[
    ['Recepción','Etapa en la que el depósito recibe y controla la mercancía entrante.','Un operario verifica los artículos que acaban de llegar del proveedor.'],
    ['Ubicación','Asignación y registro del lugar donde se guarda una mercancía.','El sistema registra en qué estante se colocó una pieza.'],
    ['Reposición','Traslado de mercancía hacia una ubicación que necesita recuperar existencias.','Se lleva una caja desde la reserva a un estante de preparación.'],
    ['Picking','Selección de los artículos necesarios para preparar un pedido.','Un operario reúne las referencias y cantidades que solicitó un cliente.'],
    ['Expedición','Etapa en que los pedidos preparados se organizan para su salida.','Los pedidos terminados esperan en el muelle al vehículo de reparto.'],
    ['Sistema de gestión de almacenes','Herramienta informática que ayuda a controlar ubicaciones y movimientos del depósito.','Una aplicación indica dónde guardar y localizar cada artículo.']
  ],wrong:'El almacén solo guarda mercancía y no participa de la preparación de pedidos.',correction:'El almacén también puede recibir, preparar y despachar pedidos.'},
  { id:'clase4', title:'Clase 4: Unidad de carga', topics:[
    ['Unidad de carga','Agrupación de mercancías que se manipula como un conjunto.','Varias cajas se agrupan de forma estable para moverlas juntas.'],
    ['Estabilidad de la carga','Condición por la que los productos agrupados se mantienen seguros durante su manejo.','Se asegura un pallet para evitar que las cajas se desplacen.'],
    ['Pallet','Plataforma que sirve de base para agrupar y manipular mercancías.','Un equipo eleva una plataforma cargada con cajas.'],
    ['Rotación','Frecuencia con la que un producto sale o se mueve en el almacén.','Una referencia se prepara varias veces al día y otra solo ocasionalmente.'],
    ['Consolidación','Reunión de productos para completar un pedido o envío.','En un sector se juntan artículos recogidos en zonas diferentes para una misma orden.'],
    ['Miniload','Sistema automático para almacenar y recuperar cajas o bandejas.','Un transelevador lleva cajas almacenadas hasta una zona de preparación.']
  ],wrong:'La unidad de carga se define sin considerar el peso, la estabilidad ni el equipo de manejo.',correction:'La unidad de carga debe ser compatible con el producto y los equipos de manipulación.'},
  { id:'clase5', title:'Clase 5: Almacenaje y manipuleo', topics:[
    ['Estantería','Estructura que organiza mercancías en posiciones y niveles de almacenamiento.','Un depósito guarda pallets en posiciones distribuidas en altura.'],
    ['Equipo de manipuleo','Equipo utilizado para elevar, mover o posicionar cargas.','Una transpaleta traslada un pallet entre dos sectores.'],
    ['Accesibilidad','Facilidad con la que se puede alcanzar y recuperar una referencia almacenada.','Se evalúa si un operario puede retirar una caja sin mover otras cargas.'],
    ['Capacidad de almacenamiento','Cantidad de mercancía o posiciones que una instalación puede alojar.','El responsable calcula cuántos pallets caben en las estanterías.'],
    ['Manejo de materiales','Conjunto de movimientos internos de productos durante la operación.','Las cargas se trasladan desde recepción hasta almacenamiento y despacho.'],
    ['Pasillo de trabajo','Espacio de circulación necesario para personas o equipos entre ubicaciones.','Se verifica que la máquina pueda maniobrar entre dos estanterías.']
  ],wrong:'Para elegir un equipo de manipuleo alcanza con mirar su precio de compra.',correction:'La elección también depende de la carga, la altura, los pasillos y la seguridad.'},
  { id:'clase6', title:'Clase 6: Preparación de pedidos', topics:[
    ['Persona a producto','Método en que el operario se desplaza hasta la mercancía para preparar el pedido.','Una persona recorre los pasillos para retirar artículos de sus ubicaciones.'],
    ['Producto a persona','Método en que un equipo acerca la mercancía al puesto de preparación.','Un transportador lleva una caja al puesto donde espera el operario.'],
    ['Picking por voz','Método de preparación que transmite y confirma instrucciones mediante voz.','Un operario recibe una ubicación por auriculares y confirma verbalmente la cantidad.'],
    ['Pick to light','Sistema de luces que indica dónde y cuántas unidades retirar.','Una señal luminosa guía la extracción en un estante.'],
    ['Put to light','Sistema de luces que indica dónde y cuántas unidades depositar para cada pedido.','Un indicador señala el contenedor donde colocar artículos para una orden.'],
    ['Preparación por olas','Organización de grupos de pedidos para coordinar su preparación.','Varias órdenes se agrupan en una tanda para coordinar recorridos.']
  ],wrong:'En producto a persona el operario debe recorrer todas las ubicaciones para buscar la carga.',correction:'En producto a persona el sistema acerca la mercancía al puesto de preparación.'},
  { id:'clase7', title:'Clase 7: Transporte', topics:[
    ['Transporte carretero','Modo que utiliza vehículos en carreteras y puede ofrecer entrega puerta a puerta.','Un camión entrega la mercadería directamente en un comercio.'],
    ['Transporte ferroviario','Modo que utiliza trenes y depende de la red de vías y terminales.','Una carga consolidada recorre una larga distancia sobre rieles.'],
    ['Transporte aéreo','Modo rápido para distancias largas, generalmente con tarifas mayores y restricciones de carga.','Una pieza urgente y de alto valor viaja en avión.'],
    ['Transporte acuático','Modo marítimo o fluvial que permite mover grandes volúmenes mediante embarcaciones.','Una carga voluminosa viaja por barco entre puertos.'],
    ['Transporte intermodal','Desplazamiento que combina dos o más modos coordinados.','Un contenedor viaja en camión y continúa por ferrocarril.'],
    ['Costo variable','Costo que cambia con la actividad o el recorrido realizado.','El consumo de combustible aumenta al realizar más viajes.']
  ],wrong:'La tarifa es el único criterio relevante para elegir un servicio de transporte.',correction:'La elección también debe considerar plazo, confiabilidad, carga y costo logístico total.'}
];

const dataDir = path.join(root, 'datos');
const save = (name, value) => fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2) + '\n');
for (const unit of units) {
  const key = `${unit.id}_conceptos`;
  save(`libro_${unit.id}.json`, { unidad:{key:unit.id,titulo:unit.title}, entradas:{ [key]:{
    categoria:'Conceptos principales', titulo:unit.title, intro:['Estos conceptos se basan en los materiales locales de la clase y ayudan a resolver los desafíos.'],
    notas:unit.topics.map(([term,definition])=>`${term}: ${definition}`), ejemplos:unit.topics.map(([, , example])=>example)
  }}});
  save(`definiciones_${unit.id}.json`, unit.topics.map(([term,definition,example],i)=>({id:`def-${unit.id}-${i+1}`,grupo:'conceptos',termino:term,definicion:definition,ejemplo:example,libro:key})));
  save(`preguntas_${unit.id}.json`, unit.topics.map(([term,definition,example],i)=>({id:`caso-${unit.id}-${i+1}`,tipo:'caso',titulo:term,situacion:example,pregunta:'¿Qué concepto describe mejor esta situación?',correcta:term,incorrectas:unit.topics.filter((_,j)=>j!==i).map(([other])=>other),pista:'Pensá en la función que cumple la actividad o el recurso en el ejemplo.',explicacion:`${term}: ${definition}`,libro:key})));
  const sentences = unit.topics.slice(0,4).map(([term,definition])=>`${term}: ${definition}`);
  const wrongIndex = Number(unit.id.slice(-1)) % 5;
  sentences.splice(wrongIndex, 0, unit.wrong);
  save(`errores_${unit.id}.json`, [{id:`error-${unit.id}`,titulo:unit.title,oraciones:sentences,incorrecta:wrongIndex,correccion:unit.correction,pista:'Revisá el alcance de cada afirmación.',explicacion:unit.correction,libro:key}]);
}
save('glosario.json', []);
console.log('Material base de siete clases generado.');
