import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useRocketPunks from "../../hooks/useRocketPunks";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const { active, account } = useWeb3React();
  const rocketPunks = useRocketPunks();
  const toast = useToast();

  const getRocketPunksData = useCallback(async () => {
    if (rocketPunks) {
      const totalSupply = await rocketPunks.methods.totalSupply().call();
      console.log("totalSupply", totalSupply);
      const dnaPreview = await rocketPunks.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const image = await rocketPunks.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
    }
  }, [rocketPunks, account]);

  useEffect(() => {
    getRocketPunksData();
  }, [getRocketPunksData]);

  const mint = () => {
    setIsMinting(true);

    rocketPunks.methods
      .mint()
      .send({
        from: account,
      })
      .on("transactionHash", (txHash) => {
        toast({
          title: "Transacción enviada",
          description: txHash,
          status: "info",
        });
      })
      .on("receipt", () => {
        setIsMinting(false);
        toast({
          title: "Transacción confirmada",
          description: "Nunca pares de aprender.",
          status: "success",
        });
      })
      .on("error", (error) => {
        setIsMinting(false);
        toast({
          title: "Transacción fallida",
          description: error.message,
          status: "error",
        });
      });
  };

  return (
    <>
      <Stack spacing={{ base: 1, md: 2 }} style={{ position: "relative" }}>
        <Text
          as={"span"}
          position={"relative"}
          _after={{
            content: "''",
            width: "100%",
            height: "20%",
            position: "absolute",
            bottom: 3,
            left: 0,
            bg: "green.300",
            zIndex: -1,
          }}
          align={"center"}
          fontWeight={600}
          fontSize={{ base: "4xl", sm: "4xl", lg: "7xl" }}
        >
          RocketAvatars
        </Text>
      </Stack>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 1 }}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <br />
            <Text as={"span"} color={"black.100"}>
              Interactua y crea tus NFTS
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Esta aplicacion es creada por medio de tecnologia SOLIDITY
            desplegando un smart contract sobre una la red de ETHEREUM que nos
            permite tener toda la informacion desentralizada.
          </Text>
          <Text color={"gray.500"}>
            RocketAvatars es una colección de NFTS aleatorios cuya metadata es
            almacenada en la red blockchain. Poseen estilos únicos y se cuenta
            con solo 10000 en existencia.
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
            style={{ justifyContent: "center" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
              disabled={!rocketPunks}
              onClick={mint}
              isLoading={isMinting}
            >
              Obtén tu punk
            </Button>
            <Link to='/punks'>
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                Galería
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          direction='column'
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Image src={active ? imageSrc : "./logoInitial.png"} />
          {active ? (
            <>
              <Flex mt={2}>
                <Badge>
                  Next ID:
                  <Badge ml={1} colorScheme='green'>
                    1
                  </Badge>
                </Badge>
                <Badge ml={2}>
                  Address:
                  <Badge ml={1} colorScheme='green'>
                    0x0000...0000
                  </Badge>
                </Badge>
              </Flex>
              <Button
                onClick={getRocketPunksData}
                mt={4}
                size='xs'
                colorScheme='green'
              >
                Actualizar
              </Button>
            </>
          ) : (
            <Badge mt={2}>Wallet desconectado</Badge>
          )}
        </Flex>
      </Stack>
    </>
  );
};

export default Home;
