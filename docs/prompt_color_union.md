Estoy trabajando en mi aplicación de gestión de objetivos desarrollada en React. Actualmente tengo tres selectores de colores distintos en tres módulos diferentes: "Objetivos", "Gestión Universitaria" y "Estados de Ánimo". Mi meta es unificar los tres en un único componente reutilizable llamado UnifiedColorPicker.

Requerimientos de Diseño y Funcionalidad:

Activador (Trigger): El componente debe mostrarse inicialmente como un círculo que representa el color seleccionado, idéntico al estilo utilizado en el módulo de "Estados de Ánimo".

Panel de Selección (Pop-over): Al hacer clic en el círculo, debe abrirse un menú con la paleta de colores completa que actualmente existe en el módulo de "Crear/Editar Objetivos".

Mejora de UI: Debes mejorar el espaciado y el layout. Actualmente se ve muy "apretado"; dale más aire (padding/gap) para que se vea profesional y limpio.

Opción RGB Avanzada: Al final de la lista de colores predefinidos, debe haber una opción marcada como "RGB".

Cambio Crítico: Actualmente, esta opción abre tres inputs numéricos (1-255). Quiero eliminar eso. En su lugar, al seleccionar "RGB", debe desplegar la paleta de selección visual (color picker gráfico) que se utiliza actualmente en el módulo de "Gestión Universitaria".

Consistencia: El componente debe ser exactamente el mismo para los tres casos de uso. Asegúrate de que las props permitan manejar el estado de forma externa para que funcione tanto en la creación de objetivos como en la configuración de módulos.

Tareas Técnicas:

Crea un componente funcional en React.

Asegúrate de mantener la armonía de colores y el grosor de las líneas (stroke) consistente con el resto de la interfaz (estilo minimalista y moderno).

Utiliza Tailwind o CSS Modules (según lo que esté usando el proyecto) para asegurar que el diseño no se vea "aplastado".

Exporta el componente de manera que pueda reemplazar las implementaciones actuales en GoalsModule, UniversityModule y MoodsModule.