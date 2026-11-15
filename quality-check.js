const assert = require('assert');
const fs = require('fs');
const path = require('path');
const read = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
const reference = read('reference.json');
const questions = read('questions.json');
const definitions = read('definitions.json');
const errors = read('errors.json');
const ids = new Set();

assert.strictEqual(reference.unidades.length, 7, 'deben existir siete clases');
for (const unit of reference.unidades) {
  const classes = [questions, definitions, errors].map(items => items.filter(item => item.unidad === unit.key));
  assert(classes[0].length >= 18 && classes[1].length >= 12 && classes[2].length >= 4, `${unit.titulo}: faltan desafíos`);
  assert(Object.values(reference.entradas).filter(entry => entry.unidad === unit.key).length >= 4, `${unit.titulo}: faltan secciones del libro`);
  assert(classes[1].every(item => classes[1].filter(other => other.grupo === item.grupo).length >= 3), `${unit.titulo}: no hay suficientes términos para emparejar`);
}
for (const item of [...questions, ...definitions, ...errors]) {
  assert(!ids.has(item.id), `id repetido: ${item.id}`);
  ids.add(item.id);
  const entry = reference.entradas[item.referencia.entradaLibro];
  assert(entry && entry.unidad === item.unidad, `${item.id}: referencia incorrecta`);
  assert(item.respuestaCorrecta && item.respuestasIncorrectas.length >= 2, `${item.id}: faltan respuestas`);
  assert(!item.respuestasIncorrectas.includes(item.respuestaCorrecta), `${item.id}: respuesta repetida`);
  assert(item.pista && item.explicacion, `${item.id}: falta pista o explicación`);
}
for (const item of questions) {
  assert(item.situacion && item.pregunta && item.respuestasIncorrectas.length >= 5, `${item.id}: caso incompleto`);
  const answers = [item.respuestaCorrecta, ...item.respuestasIncorrectas].map(text => text.trim().toLocaleLowerCase('es'));
  assert.strictEqual(new Set(answers).size, answers.length, `${item.id}: opciones duplicadas`);
}
for (const item of errors) {
  assert.strictEqual(item.oraciones.length, 5, `${item.id}: debe tener cinco oraciones`);
  assert.strictEqual(item.oraciones[item.incorrecta], item.respuestaCorrecta, `${item.id}: índice incorrecto`);
}
for (const [key, entry] of Object.entries(reference.entradas)) {
  assert(entry.titulo && entry.intro && entry.notas.length && entry.ejemplos?.length, `${key}: entrada incompleta`);
}
console.log(`${reference.unidades.length} clases, ${questions.length} casos, ${definitions.length} definiciones y ${errors.length} errores verificados.`);
