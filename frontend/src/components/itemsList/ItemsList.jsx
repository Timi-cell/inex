import React, { useEffect, useState } from "react";
import "./ItemsList.scss";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { SpinnerImg } from "../loader/Loader";
import { formatNumbers } from "../../pages/dashboard/Dashboard";
import ReactPaginate from "react-paginate";

const ItemsList = ({ loadingStatus, items, deleteItem, editItem, message }) => {
  // Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, items, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  // End Pagination
  return (
    <div className="items-list">
      {loadingStatus === "loading" && <SpinnerImg />}
      <div>
        {/* {items.length === 0 && message ? <h3>No items found.</h3> : ""} */}
        {loadingStatus === "succeeded" && items.length === 0 ? (
          message ? (
            <h3>Item not found.</h3>
          ) : (
            <p>No items added.</p>
          )
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Value</th>
                <th>Time Added</th>
                <th>Time Updated</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, id) => (
                <tr key={id}>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{`#${formatNumbers(item.value)}`}</td>
                  <td>{new Date(item.createdAt).toLocaleTimeString()}</td>
                  <td>
                    {new Date(item.updatedAt).toLocaleTimeString() ===
                    new Date(item.createdAt).toLocaleTimeString()
                      ? "Not updated yet"
                      : new Date(item.updatedAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <div onClick={() => editItem(item)}>
                      <FaEdit size={30} /> <span>Edit</span>
                    </div>
                    <div onClick={() => deleteItem(item._id, item)}>
                      <AiFillDelete size={30} color="var(--red)" />{" "}
                      <span>Delete</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ReactPaginate
        breakLabel=""
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </div>
  );
};

export default ItemsList;
