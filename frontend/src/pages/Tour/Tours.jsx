import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SEO/searchBar";
import Title from "../../stories/Title";
import TourPackages from "../../Featured/tourPackages";
import "../../styles/pages/tours.scss";
import Button from "../../stories/Button";

const Tours = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);

  useEffect(() => {
    const pages = Math.ceil(100 / 10); // Assuming 100 total items and 10 items per page
    setPageCount(pages);
    //  const pagesArray = Array.from({ length: pages }, (_, i) => i + 1);
  }, []);

  const header = {
    title: "Explore the world with our",
    highlight: "tours",
  };
  return (
    <div>
      <Title text={header.title} />{" "}
      <span>
        <Title text={header.highlight} variant="secondary" />
      </span>
      <SearchBar />
      <TourPackages />
      <div className="ui-tours__pagination">
        <Button
          className="ui-tours__pagination__button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          text={"Previous"}
          variant="outline"
        />{" "}
        <span className="ui-tours__pagination__current-page">{page}</span>
        <Button
          className="ui-tours__pagination__button"
          onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
          disabled={page === pageCount}
          text={"Next"}
          variant="outline"
        />
      </div>
      /
    </div>
  );
};

export default Tours;
