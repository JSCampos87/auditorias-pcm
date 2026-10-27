/* Configuração do envio automático de email (EmailJS) — Auditorias PCM
   Preencha os 3 códigos da sua conta em emailjs.com (os mesmos da app PCV Ferramentas, se já existirem):
     publicKey  -> Account > API Keys > Public Key
     serviceId  -> Email Services > Service ID
     templateId -> Email Templates > Template ID
   O modelo (template) no EmailJS deve ter:  To = {{to_email}}   Subject = {{subject}}   Conteúdo = {{message}}
   Enquanto ficarem vazios, a app abre o email já preenchido e o auditor só toca em Enviar. */
window.PCV_CONFIG = window.PCV_CONFIG || {};
window.PCV_CONFIG.emailjs = {
  publicKey: "",
  serviceId: "",
  templateId: ""
};
