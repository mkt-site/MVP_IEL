const portes = [
"Microempresa",
"Pequena Empresa",
"Média Empresa",
"Grande Empresa"
];

const urgencias = [
"🔵 Apenas pesquisando",
"🟢 Próximos meses",
"🟡 Próximas semanas",
"🔴 Preciso agora"
];

const categorias = [
"🎓 Estágio",
"🚀 Inova Talentos",
"💼 Protalent",
"📊 Observatório FIESC",
"👥 Recruta Talentos",
"🏢 Sou Empresa",
"🙋 Sou Candidato"
];

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxB6VReIHEhTOIPsuILicheuiIMnPR_KpvrCTP9isoqOc8Pf8Abf1vMI0uJMXe2pyLr/exec";

const campos = [
"nome",
"empresa",
"whatsapp",
"categoria",
"necessidade",
"urgencia",
"potencial"
];

const perguntas = {

nome:
"Olá 👋 Seja bem-vindo ao IEL Santa Catarina. Qual é o seu nome?",

empresa:
"Qual o nome da empresa ou instituição?",

whatsapp:
"Qual seu WhatsApp para contato?",

categoria:
"Qual serviço você procura?",

necessidade:
"Conte um pouco mais sobre sua necessidade.",

urgencia:
"Qual a urgência da demanda?",

porte:
"Qual o porte da empresa?"
};

let etapa = 0;
let lead = {};

document.body.insertAdjacentHTML("beforeend",`

<div class="chat-overlay"></div>

<div class="chat-btn">

<span class="desktop-chat">
💬 Atendimento
</span>

<span class="mobile-chat">
💬
</span>

</div>

<div class="chat-window">

<div class="chat-header">

<span>IEL Santa Catarina</span>

<span class="chat-close">✖</span>

</div>

<div class="chat-messages"></div>

<div class="chat-input">
<input type="text" id="chatInput">
<button id="sendBtn">Enviar</button>
</div>

</div>

`);

const btn = document.querySelector(".chat-btn");
const janela = document.querySelector(".chat-window");
const mensagens = document.querySelector(".chat-messages");
const fechar = document.querySelector(".chat-close");
const overlay = document.querySelector(".chat-overlay");

fechar.onclick = () => {

overlay.style.display = "none";
janela.style.display = "none";

etapa = 0;
lead = {};

mensagens.innerHTML = "";

};

btn.onclick = () => {

overlay.style.display = "block";
janela.style.display = "flex";

if(mensagens.innerHTML === ""){

bot(perguntas.nome);

}

};

window.addEventListener("load", () => {

setTimeout(() => {

overlay.style.display = "block";
janela.style.display = "flex";

if(mensagens.innerHTML === ""){

bot(perguntas.nome);

}

}, 1500);

});


function bot(msg){

mensagens.innerHTML += `
<div class="bot">
${msg}
</div>
`;

mensagens.scrollTop = mensagens.scrollHeight;

}

function user(msg){

mensagens.innerHTML += `
<div class="user">
${msg}
</div>
`;

mensagens.scrollTop = mensagens.scrollHeight;

}

function mostrarBotoes(lista){

let html = '<div class="opcoes">';

lista.forEach(item => {

html += `
<button class="opcao-btn">
${item}
</button>
`;

});

html += '</div>';

mensagens.innerHTML += html;

document.querySelectorAll(".opcao-btn").forEach(btn => {

btn.onclick = () => {

document.querySelectorAll(".opcoes").forEach(op => {
op.remove();
});

document.getElementById("chatInput").value =
btn.innerText;

enviar();

};

});

}

document.getElementById("sendBtn").onclick = enviar;

document.getElementById("chatInput").addEventListener("keypress", e => {

if(e.key === "Enter")
enviar();

});

function enviar(){

const input = document.getElementById("chatInput");

const valor = input.value.trim();

if(!valor) return;

user(valor);

lead[campos[etapa]] = valor;

input.value = "";

etapa++;

if(etapa < campos.length){

bot(perguntas[campos[etapa]]);

if(campos[etapa] === "categoria"){

mostrarBotoes(categorias);

}

if(campos[etapa] === "urgencia"){

mostrarBotoes(urgencias);

}

if(campos[etapa] === "porte"){

mostrarBotoes(portes);

}

}
else{

finalizar();

}

}

function calcularScore(){

let score = 0;

const urgencia =
(lead.urgencia || "").toLowerCase();

const porte =
(lead.porte || "").toLowerCase();

if(urgencia.includes("agora"))
score += 50;

else if(urgencia.includes("seman"))
score += 30;

else if(urgencia.includes("mes"))
score += 15;

if(porte.includes("grande"))
score += 40;

else if(porte.includes("média"))
score += 25;

else if(porte.includes("pequena"))
score += 15;

else if(porte.includes("micro"))
score += 10;

return score;

}

function classificar(score){

if(score >= 80)
return "Quente";

if(score >= 50)
return "Morno";

return "Frio";

}

async function finalizar(){

lead.dataHora =
new Date().toLocaleString("pt-BR");

lead.score =
calcularScore();

lead.classificacao =
classificar(lead.score);

bot("🔍 Analisando informações...");

await fetch(SCRIPT_URL,{

method:"POST",

mode:"no-cors",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify(lead)

});

bot(`

✅ Solicitação recebida com sucesso.

Obrigado pelas informações, ${lead.nome}.

Nossa equipe irá analisar sua solicitação e direcionar para o programa mais adequado.

📌 IEL Santa Catarina
🎓 Educação, Inovação e Desenvolvimento de Talentos

Em breve entraremos em contato através dos canais informados.

`);

}

const input = document.getElementById("chatInput");

input.addEventListener("focus", () => {

setTimeout(() => {

mensagens.scrollTop =
mensagens.scrollHeight;

}, 300);

});
