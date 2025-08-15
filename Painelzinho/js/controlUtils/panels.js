// Painelzinho/js/controlUtils/panels.js
function clonePainel(templateId, targetContainerId, newIndex) {
    const template = document.getElementById(templateId);
    const clone = template.content.cloneNode(true);

    // Atualiza IDs dentro do clone
    clone.querySelectorAll('[id]').forEach(el => {
        el.id = el.id.replace('alt-1', `alt-${newIndex}`);
    });

    // Atualiza atributos que dependem de IDs (labels, inputs, for, etc)
    clone.querySelectorAll('[for]').forEach(el => {
        el.htmlFor = el.htmlFor.replace('alt-1', `alt-${newIndex}`);
    });

    document.getElementById(targetContainerId).appendChild(clone);

    return document.getElementById(`alt-${newIndex}-config-content`);
}
