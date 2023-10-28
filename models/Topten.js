import mongoose, { models } from "mongoose";

const topTenSchema = new mongoose.Schema(
  {
    dataIndex: {
      type: Number,
      unique: true,
    },
    top_movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware işlevi ekliyoruz
topTenSchema.pre("save", async function (next) {
  if (!this.dataIndex) {
    const highestDataIndex = await this.constructor.findOne(
      {},
      {},
      { sort: { dataIndex: -1 } }
    );
    this.dataIndex = highestDataIndex ? highestDataIndex.dataIndex + 1 : 1;
  }
  next();
});

// Belge silindiğinde bu middleware'i kullanarak index güncelleme işlevini ekliyoruz
topTenSchema.pre("remove", { document: true, query: false }, async function () {
  const toBeDeletedDataIndex = this.dataIndex;
  await this.constructor.updateMany(
    { dataIndex: { $gt: toBeDeletedDataIndex } },
    { $inc: { dataIndex: -1 } }
  );
});
// Maksimum 10 belgeyi kontrol etmek için middleware ekliyoruz
topTenSchema.pre("save", async function (next) {
  const count = await this.constructor.countDocuments();
  if (count >= 10) {
    // Maksimum sınıra ulaşıldı, yeni belgeyi kaydetme
    const error = new Error("Maksimum belge sayısına ulaşıldı.");
    return next(error);
  }
  next();
});
const Topten = models?.Topten || mongoose.model("Topten", topTenSchema);
export default Topten;
