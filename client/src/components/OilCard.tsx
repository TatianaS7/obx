import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import OilSchema from "../../../server/schemas";
import "../styles/OilCard.css"

interface OilCardProps {
  oil: OilSchema;
}

export default function OilCard({ oil }: OilCardProps) {
  return (
    <Card className="oil-card">
      <CardContent sx={{padding: 0}}>
        <CardHeader
        id="oil-card-header"
          title={
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              {oil.name}
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" color="text.secondary">
              {oil.oil_type}
            </Typography>
          }
          style={{ textAlign: "center" }}
        />
        <Typography variant="body1" color="text.secondary">
          {oil.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
