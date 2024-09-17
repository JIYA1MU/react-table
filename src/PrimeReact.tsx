import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { OverlayPanel } from "primereact/overlaypanel";

interface TableValue {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: string;
}

interface LazyTableState {
  first: number;
  rows: number;
  page: number | undefined;
}

const columns = [
  { field: "title", header: "Title" },
  { field: "place_of_origin", header: "Place of Origin" },
  { field: "artist_display", header: "Artist Display" },
  { field: "inscriptions", header: "Inscriptions" },
  { field: "date_start", header: "Date Start" },
  { field: "date_end", header: "Date End" },
];

const PrimeReact = () => {
  const [data, setData] = useState<TableValue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<TableValue[] | null>(
    null
  );
  const [paginationData, setPaginataionData] = useState<any>({});
  const [lazyState, setLazyState] = useState<LazyTableState>({
    first: 0,
    rows: 12,
    page: 0,
  });
  const op = useRef<OverlayPanel | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${lazyState.page! + 1}`
      );
      setData(response.data?.data);
      setPaginataionData(response.data?.pagination);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lazyState]);

  const header = () => (
    <div>
      <OverlayPanel
        ref={op}
        showCloseIcon
        className="my-10 h-30 w-64 bg-white shadow-lg rounded-md"
      >
        <div className="w-full flex flex-col justify-end items-end">
          <input
            type="text"
            name="rows"
            placeholder="Select rows...."
            className="outline-none p-2 w-full border border-gray-300 rounded-md"
          />

          <button
            type="submit"
            className="p-2 my-2 rounded-md border border-gray-300 "
          >
            Submit
          </button>
        </div>
      </OverlayPanel>
      <IoIosArrowDown
        className="cursor-pointer absolute top-[2rem] left-[3rem]"
        onClick={(e) => op.current?.toggle(e)}
      />
    </div>
  );

  return (
    <div>
      <DataTable
        value={data}
        lazy
        paginator
        rows={12}
        tableStyle={{
          minWidth: "50rem",
        }}
        loading={loading}
        selectionMode={"multiple"}
        selection={selectedProducts!}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
        onPage={(e) => {
          console.log(e);
          setLazyState({
            first: e.first,
            rows: e.rows,
            page: e.page,
          });
        }}
        totalRecords={paginationData.total}
        first={lazyState.first}
      >
        <Column
          selectionMode="multiple"
          header={header()}
          className="relative"
        ></Column>
        {columns.map((item) => (
          <Column key={item.field} field={item.field} header={item.header} />
        ))}
      </DataTable>
    </div>
  );
};

export default PrimeReact;
