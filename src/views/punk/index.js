import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import PunkCard from "../../components/punk-card";
import { useRocketPunkData } from "../../hooks/useRocketPunksData";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useState } from "react";
import useRocketPunks from "../../hooks/useRocketPunks";
import Swal from "sweetalert2";

const Punk = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { loading, punk, update } = useRocketPunkData(tokenId);
  const rocketPunks = useRocketPunks();
  const toast = useToast();
  const [transfering, setTransfering] = useState(true);

  const transfer = () => {
    setTransfering(true);

    const address = Swal.fire({
      title: "Ingresa la dirección:",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      confirmButtonColor: "#308d5c",
      showCloseButton: true,
      preConfirm: (idAddress) => {
        const isAddress = library.utils.isAddress(idAddress);
        if (!isAddress) {
          toast({
            title: "Dirección inválida",
            description: "La dirección no es una dirección de Ethereum",
            status: "error",
          });
        } else {
          rocketPunks.methods
            .safeTransferFrom(punk.owner, idAddress, punk.tokenId)
            .send({
              from: account,
            })
            .on("error", () => {
              setTransfering(true);
            })
            .on("transactionHash", (txHash) => {
              setTransfering(false)
              toast({
                title: "Transacción enviada",
                description: txHash,
                status: "info",
              });
            })
            .on("receipt", () => {
              setTransfering(true);
              toast({
                title: "Transacción confirmada",
                description: `El punk ahora pertenece a ${idAddress}`,
                status: "success",
              });
              update();
            });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(false),
    });
  };

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack style={{ justifyContent: "center", alignItems: "center" }}>
      <Stack
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PunkCard name={punk.name} image={punk.image} />
        <Button
          onClick={transfer}
          disabled={account !== punk.owner}
          colorScheme='green'
          isLoading={!transfering}
          width={330}
        >
          {account !== punk.owner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack width='100%' spacing={5}>
          <Heading>{punk.name}</Heading>
          <Text fontSize='xl'>{punk.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2} colorScheme='green'>
              {punk.dna}
            </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme='green'>
              {punk.owner}
            </Tag>
          </Text>
          <Table size='sm' variant='simple'>
            <Thead>
              <Tr>
                <Th>Atributo</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(punk.attributes).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  <Td>
                    <Tag>{value}</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Punk;
