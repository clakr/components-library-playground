import {
  Container,
  Paper as MaterialPaper,
  TableCell as MaterialTableCell,
  Stack,
  Table,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import { TableCellBaseProps } from "@mui/material/TableCell";
import { PropsWithChildren, useEffect, useState } from "react";
import react from "./assets/react.svg";

type TableHeading = {
  name: string;
};

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

const tableHeadings: TableHeading[] = [
  {
    name: "#",
  },
  {
    name: "Avatar",
  },
  {
    name: "Email",
  },
  {
    name: "First Name",
  },
  {
    name: "Last Name",
  },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchUsers = async () => {
      if (!isSubscribed) {
        return;
      }

      let tempData: User[] = [];

      await Promise.all(
        [
          "https://reqres.in/api/users?page=1",
          "https://reqres.in/api/users?page=2",
        ].map(
          async (url) =>
            await fetch(url)
              .then((promise) => promise.json())
              .then(({ data }) => {
                tempData = [...tempData, ...data];
              })
              .finally(() => {
                const sortedData = tempData.sort((a, b) => {
                  if (a.id > b.id) return -1;
                  if (a.id < b.id) return +1;
                  return 0;
                });

                setUsers(sortedData);
              })
        )
      );
    };

    fetchUsers();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <>
      <Container
        component="main"
        sx={{
          minHeight: "100vh",
          paddingBlock: "2em",
        }}
      >
        <Stack spacing={2} component="section" sx={{ width: "100%" }}>
          <Typography variant="h2">Users</Typography>
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                {tableHeadings.map(({ name }, index) => (
                  <TableCell key={index}>{name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell align="center" colSpan={tableHeadings.length}>
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {users.map(
                    ({ id, avatar, email, first_name, last_name }, index) => (
                      <TableRow key={index}>
                        <TableCell>{id}</TableCell>
                        <TableCell>
                          <img
                            src={avatar ?? react}
                            alt={`${first_name}'s Avatar`}
                            loading="lazy"
                            style={{
                              borderRadius: "50%",
                              height: "5em",
                              width: "5em",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                        </TableCell>
                        <TableCell>{email}</TableCell>
                        <TableCell>{first_name}</TableCell>
                        <TableCell>{last_name}</TableCell>
                      </TableRow>
                    )
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Stack>
      </Container>
    </>
  );
}

export default App;

const Paper = ({ children }: PropsWithChildren) => {
  return <MaterialPaper component="table">{children}</MaterialPaper>;
};

const TableCell = ({
  children,
  ...rest
}: PropsWithChildren<TableCellBaseProps>) => {
  return (
    <MaterialTableCell {...rest} sx={{ fontSize: "1.5em" }} align="center">
      {children}
    </MaterialTableCell>
  );
};
