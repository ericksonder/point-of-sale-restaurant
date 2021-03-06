import { collection, getDocs } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase";
import DataTable from "../../03-organisms/DataTable/DataTable";
import ShowStats from "../../03-organisms/ShowStats/ShowStats";
import Button from "../../01-atoms/Buttons/Button/Button";
import "../../04-templates/tablePage-template/styles.css";
import Heading from "../../01-atoms/Heading/Heading";
import { useHistory } from "react-router";
import "./styles.css";
import ModalEditarCliente from "../../02-molecules/ModalEditarCliente/ModalEditarCliente";

const ClientesPage = () => {
  const [modalEditarCliente, setModalEditarCliente] = useState(false);
  const onToggle = () => setModalEditarCliente((prevState) => !prevState);
  const [reloadData, setReloadData] = useState(false);
  const [objClienteModal, setObjClienteModal] = useState({});
  const resetClienteModal = () => setObjClienteModal({});

  const history = useHistory();
  const data = {
    columns: [
      {
        label: "Nombre",
        field: "nombre",
        sort: "asc",
      },
      {
        label: "Apellidos",
        field: "apellidos",
        sort: "asc",
      },
      {
        label: "Celular",
        field: "celular",
        sort: "asc",
      },
      {
        label: "",
        field: "acciones",
      },
    ],
    rows: [],
  };

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const filas = clientes.map((cliente) => {
    return {
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      celular: cliente.celular,
      acciones: (
        <div className="clientes__actions">
          <Button
            action={() => {
              setObjClienteModal(cliente);
              onToggle();
            }}
            variant="secondary"
            size="sm"
            style={{ width: "8rem" }}
          >
            Editar
          </Button>
          <Button
            action={() =>
              history.push(`/clientes/pedidos-cliente/${cliente.id}`, cliente)
            }
            size="sm"
            style={{ width: "8rem" }}
          >
            Pedidos
          </Button>
        </div>
      ),
    };
  });

  data.rows = filas.length > 0 ? filas : [];

  useEffect(() => {
    const getClientes = async () => {
      try {
        setLoading(true);
        const { docs } = await getDocs(collection(db, "clientes"));
        const data = docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (Array.isArray(data)) {
          setClientes(data);
        }
        setLoading(false);
      } catch (err) {
        console.log("Error ", err);
        setLoading(false);
      }
    };
    getClientes();
  }, [reloadData]);

  const stats = [
    {
      number: clientes.length,
      label: "Clientes",
    },
  ];

  return (
    <>
      <ModalEditarCliente
        resetClienteModal={resetClienteModal}
        isOpen={modalEditarCliente}
        onToggle={onToggle}
        reloadData={() => setReloadData((prev) => !prev)}
        cliente={objClienteModal}
      />
      <div className="table-page-template">
        <div className="table-page-template__col-1">
          <div className="header">
            <Heading size="lg">Clientes</Heading>

            <ShowStats stats={stats} />
          </div>
          <div className="body">
            <DataTable
              shadow={false}
              data={data}
              title="Lista de clientes"
              loading={loading}
            />
          </div>
        </div>
        {/* <div className="table-page-template__col-2"></div> */}
      </div>
    </>
  );
};

export default ClientesPage;
