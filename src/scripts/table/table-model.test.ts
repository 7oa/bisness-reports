import data from "../../../mocks/data";
import {
  simpleData,
  simpleDataSortAsc,
  simpleDataSortDesc,
  simpleDataFilter,
  simpleDataFilter2,
} from "../../../mocks/simple";
import TableModel from "./table-model";

describe("TableModel", () => {
  let tableModel: TableModel;

  beforeEach(() => {
    tableModel = new TableModel({
      data,
      itemsPerPage: 10,
    });
  });

  describe("set TableModel props", () => {
    it("set data", () => {
      expect(tableModel.data).toEqual(data);
    });
    it("set initialData equal data", () => {
      expect(tableModel.initialData).toEqual(data);
    });
    it("set itemsPerPage", () => {
      expect(tableModel.itemsPerPage).toEqual(10);
    });
    it("set currentPage", () => {
      expect(tableModel.currentPage).toEqual(1);
    });
    it("set filter", () => {
      expect(tableModel.filter).toEqual([]);
    });
    it("set sortOrder", () => {
      expect(tableModel.sortOrder).toEqual("");
    });
    it("set sortField", () => {
      expect(tableModel.sortField).toEqual("");
    });
  });

  describe("setSort", () => {
    it("sortOrder shoud be 'asc', sortField shoud be 'clicks'", () => {
      tableModel.setSort("clicks", "asc");
      expect(tableModel.sortOrder).toEqual("asc");
      expect(tableModel.sortField).toEqual("clicks");
    });
  });

  describe("setFilter", () => {
    it("filter set to []", () => {
      tableModel.setFilter([]);
      expect(tableModel.filter).toEqual([]);
    });
    it("filter set to array with 1 object", () => {
      const filter = [{ name: "name", title: "title", min: "10", max: "10" }];
      tableModel.setFilter(filter);
      expect(tableModel.filter).toEqual(filter);
    });
    it("filter set to array with 2 objects", () => {
      const filter = [
        { name: "name", title: "title", min: "10", max: "10" },
        { name: "name1", title: "title2", min: "120", max: "1220" },
      ];
      tableModel.setFilter(filter);
      expect(tableModel.filter).toEqual(filter);
    });
  });

  // describe("updateData", () => {});
  describe("sortData", () => {
    it("without sort", () => {
      tableModel.sortField = "age";
      tableModel.sortOrder = "";
      expect(tableModel.sortData(simpleData)).toEqual(simpleData);
    });
    it("sort asc", () => {
      tableModel.sortField = "age";
      tableModel.sortOrder = "asc";
      expect(tableModel.sortData(simpleData)).toEqual(simpleDataSortAsc);
    });
    it("sort desc", () => {
      tableModel.sortField = "age";
      tableModel.sortOrder = "desc";
      expect(tableModel.sortData(simpleData)).toEqual(simpleDataSortDesc);
    });
  });

  describe("filterData", () => {
    it("age 23-100", () => {
      tableModel.filter = [{ name: "age", title: "Age", min: "23", max: "100" }];
      expect(tableModel.filterData(simpleData)).toEqual(simpleDataFilter);
    });
    it("age 0-11", () => {
      tableModel.filter = [{ name: "age", title: "Age", min: "0", max: "11" }];
      expect(tableModel.filterData(simpleData)).toEqual(simpleDataFilter2);
    });
  });

  describe("getNewSortOrder", () => {
    it("getNewSortOrder('asc') should return 'desc'", () => {
      expect(tableModel.getNewSortOrder("asc")).toEqual("desc");
    });
    it("getNewSortOrder('desc') should return ''", () => {
      expect(tableModel.getNewSortOrder("desc")).toEqual("");
    });
    it("getNewSortOrder('') should return 'asc'", () => {
      expect(tableModel.getNewSortOrder("")).toEqual("asc");
    });
  });

  // describe("getData", () => {});
});
