import { LoaderIcon, SearchIcon } from "lucide-react";

const SellerSearch = () => {
  // const { searchQuery, setSearchQuery } = useSearchStore();
  // const { handleSearch, searchLoading } = useSearchHook();
  // const params = useParams();
  // console.log(params.cat)
  // // const router = useRouter();

  // useEffect(() => {
  //   if (params.cat) {
  //     setSearchQuery(params.cat);
  //   }
  // }, [params.cat, setSearchQuery]);


  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // handleSearch();
    }}>
      <div className="flex h-9 items-center mx-5 sm:mx-0 gap-2 sm:min-w-sm md:min-w-md lg:min-w-full border px-3 rounded-sm">
        <button type="submit">
          {false //loading state
          ? <LoaderIcon className="animate-spin size-4 shrink-0 opacity-50 text-foreground" /> 
          : <SearchIcon className="size-4 shrink-0 opacity-50 text-foreground" />}
        </button>
        <input
          type="text"
          disabled={false} //loading state
          name="search"
          autoComplete="off"
          // value={searchQuery} 
          placeholder="Search Product List"
          className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden 
          disabled:cursor-not-allowed disabled:opacity-50"
          // onChange={(e) => {
          //   setSearchQuery(e.target.value)
          // }}
        />
      </div>
    </form>
  );
};

export default SellerSearch;