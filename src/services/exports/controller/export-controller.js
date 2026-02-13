import response from "../../../utils/response.js";
import ExportService from "../producers/export-service.js";

export const exportNotes = async (req, res) => {
  const { targetEmail } = req.validated;
  const { id: userId } = req.user;

  const message = {
    userId,
    targetEmail
  };

  await ExportService.sendMessage('export:notes', JSON.stringify(message));
  return response(res, 201, 'Permintaan Anda dalam antrean');
};
