import React, { useContext, useEffect, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
  type View,
} from "react-big-calendar";
import moment from "moment";
import { AuthContext } from "../../Context/ContextConfig";

// IMPORTANTE: Estilos globales obligatorios para la estructura y clicks del calendario
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  DashboardContainer,
  DashboardHeader,
  DashboardText,
  DashboardTitle,
} from "../dashboard";

// Configuración de idioma en español para los meses y días en moment
moment.locale("es");

const localizer = momentLocalizer(moment);

// Interfaz para el tipado de los eventos que Big Calendar requiere
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: {
    numpoliza: string;
  };
}

// Interfaz que hace match exacto con el JSON de tu API de Go
interface BirthdatePayload {
  nombrecompleto: string;
  birthdate: string;
  numpoliza: string;
}

const CalendarComp: React.FC = () => {
  const auth = useContext(AuthContext);

  // Estados para los datos del backend
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ESTADOS CONTROLADOS: Reviven la interactividad de los botones del Toolbar
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        // Validamos que la sesión exista de verdad
        if (auth?.session == null) {
          throw new Error("No existe sesión activa");
        }

        const jwt = localStorage.getItem("session_jwt");
        const calendar_data = await fetch(
          `${import.meta.env.VITE_API_SERVER_URL}/v1/polizas/birthdates`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          },
        );

        const response = await calendar_data.json();

        if (response.success && response.payload) {
          // Mapeamos los strings ISO de Go a objetos Date nativos de JavaScript
          const formattedEvents: CalendarEvent[] = response.payload.map(
            (item: BirthdatePayload) => {
              const dateObj = new Date(item.birthdate); // Ajuste de un día para corregir desfase de Go a JS
              dateObj.setDate(dateObj.getDate() + 1); // Ajuste de un día para corregir desfase de Go a JS
              return {
                title: `🎂 ${item.nombrecompleto}`,
                start: dateObj,
                end: dateObj,
                allDay: true, // Bloque estético superior para eventos de todo el día
                resource: {
                  numpoliza: item.numpoliza,
                },
              };
            },
          );
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error en la petición de cumpleaños:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, [auth?.session]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontSize: "1.2rem" }}>
        Cargando calendario de cumpleaños...
      </div>
    );
  }

  return (
    <>
      <DashboardContainer>
        <DashboardHeader>
          <DashboardTitle>Mi calendario</DashboardTitle>

          <DashboardText $theme="Light">
            Descubre quien es el siguiente cumpleañero
          </DashboardText>
        </DashboardHeader>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }} // Altura fija ideal para visualización mensual
            // PROPIEDADES CRÍTICAS: Enlazan los clicks de los botones al estado de React
            date={currentDate}
            view={currentView}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            onView={(newView) => setCurrentView(newView)}
            // Traducción completa de la interfaz del componente
            messages={{
              next: "Sig.",
              previous: "Ant.",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Asegurado",
              noEventsInRange: "No hay cumpleaños registrados en este mes.",
            }}
            // Acción interactiva cuando el agente presiona sobre el cumpleaños de un cliente
            onSelectEvent={(event) => {
                console.log(`Cumpleaños: ${event.title}\nNúmero de Póliza: ${event.resource?.numpoliza}`);
            //   alert(
            //     `Cumpleaños: ${event.title}\nNúmero de Póliza: ${event.resource?.numpoliza}`,
            //   );
            }}
          />
        </div>
      </DashboardContainer>
    </>
  );
};

export default CalendarComp;
