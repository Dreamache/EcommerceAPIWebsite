export function fmt(value) {
  return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
}
export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}
export function fmtDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
