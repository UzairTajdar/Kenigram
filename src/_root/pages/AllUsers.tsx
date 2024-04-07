import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutations";
import { useState } from "react";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedUsers: any;
};

const SearchResults = ({ isSearchFetching, searchedUsers }: SearchResultProps) => {
  if (isSearchFetching) {
    return <div className="col-span-12 mt-5"> <Loader /></div> 
  } else if (searchedUsers && searchedUsers.documents.length >  0) {
    return searchedUsers.documents.map((creator :any) => (
      <UserCard key={creator?.$id} user={creator} className='col-span-12 sm:col-span-6 md:col-span-4' />
    ));
  } else {
    return (
      <p className="text-light-4 mt-10 col-span-12 text-center w-full">No results found</p>
    );
  }
};


const AllUsers = () => {
  
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedSearch);


  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }
  const shouldShowSearchResults = searchValue !== "";
  

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
         <div className="w-full">
           <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 mb-10">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
        {shouldShowSearchResults ?(
            <div className="grid grid-cols-12 gap-4 w-full">
                 <SearchResults
           isSearchFetching={isSearchFetching}
           searchedUsers={searchedUsers}
         />  
            </div>):(
           <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
         </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;