/* Ligação da app Auditorias PCM ao Excel mestre (EmailJS)
   Cada auditoria gravada segue em segundo plano para a caixa "destino"; a tarefa automática lê-a e escreve-a no Excel mestre.
     publicKey            -> EmailJS > Account > Public Key
     serviceId            -> EmailJS > Email Services > Service ID
     templateIdAuditorias -> EmailJS > Email Templates > modelo "Auditoria PCM" > Template ID
   Modelo "Auditoria PCM":  To Email = {{to_email}}   Subject = {{subject}}   Content = {{message}} */
window.PCV_CONFIG = window.PCV_CONFIG || {};
window.PCV_CONFIG.emailjs = Object.assign(window.PCV_CONFIG.emailjs || {}, {
  publicKey: "rHK1AkbCr-1rYxskL",
  serviceId: "service_1kvimmm",
  templateIdAuditorias: "template_pndfbeo",
  destino: "joao.campos@graphicsleader.pt"
});
